Plan: add a `/profile` screen with persisted user data and compatibility guide for work done in another Lovable project

## Goal
Add a dedicated `/profile` route where the signed-in user can see and later edit their name, avatar/photo, and study-progress statistics. The feature is backed by Lovable Cloud (database + auth), and any exploratory work done in a separate Lovable project can be merged back into this project without conflicts.

## What we will build

1. **Backend / data layer**
   - Enable Lovable Cloud on this project.
   - Add a `public.profiles` table with columns for user id, display name, avatar url, and updated timestamps.
   - Add a `public.user_progress` table (or use a JSON-friendly column in `profiles` for the first iteration) that stores completed activities, per-trail progress, and study-area progress.
   - Write the required `GRANT` statements and RLS policies so only the authenticated owner can read/write their own row.
   - Add `.functions.ts` server functions: `getProfile`, `updateProfile`, `getUserProgress`. Protected functions use `requireSupabaseAuth` middleware.

2. **Route and UI**
   - Create `src/routes/_authenticated/profile.tsx` so the profile page is protected by the existing auth layout (or a new `_authenticated` layout if not present yet).
   - Build the profile page with sections: identity (name + avatar), progress summary (overall %, completed activities, per-area progress), and a placeholder for future stats/achievements.
   - Reuse the existing design system: Sora/Manrope fonts, oklch tokens from `src/styles.css`, Tailwind semantic classes (`bg-background`, `text-foreground`, `border-border`, `bg-card`, etc.), and Lucide icons. No hardcoded colors or emojis.

3. **Integration with existing navigation**
   - Wire `getUserProgress` to the existing `navigationStructure` so the UI shows real progress instead of placeholder percentages.
   - Keep study-area unlock behavior unchanged (all areas remain open; only in-trail order is enforced).

4. **Workflow for the other Lovable project**
   - Prototype the profile UI in the second Lovable project if desired, but treat it as a throwaway sandbox.
   - When bringing code back, copy only the component files and adapt imports to this project’s alias map (`@/components`, `@/lib`, etc.).
   - Never bring a second router, a second `__root.tsx`, or a different CSS framework. TanStack Router and Tailwind v4 are fixed here.
   - Replace any mock data/API calls with the `createServerFn` functions defined above; do not carry over `fetch("/api/...")` or Next.js patterns.

## Technical details for compatibility

- **Router**: this project uses TanStack Router file-based routing. A profile page must be a file under `src/routes/` named according to the desired URL. Protected routes belong under `_authenticated/` so the auth guard runs before loaders. Dynamic segments use `$param`, not `:param`.
- **Data loading**: use `context.queryClient.ensureQueryData(queryOptions)` in the loader and `useSuspenseQuery` in the component. Do not use `useEffect` + `fetch` for the initial data load.
- **Server code**: put RPC logic in `src/lib/profile.functions.ts` or `src/routes/_authenticated/profile.functions.ts`, never directly in route loaders. Loaders may only call these functions from under `_authenticated/`.
- **Auth**: protected server functions use `.middleware([requireSupabaseAuth])`. Read `context.userId` and `context.supabase` inside the handler. Do not pass the access token manually.
- **Styling**: all colors come from `src/styles.css` tokens. No `bg-white`, `text-black`, `bg-[#...]`, or inline emoji icons. Use `lucide-react` icons and the existing area accent tokens when needed.
- **Database**: every new public table needs a `GRANT` block in the same migration, followed by `ENABLE ROW LEVEL SECURITY`, then policies. RLS alone is not enough.
- **Files not to touch**: `src/routeTree.gen.ts` (generated), `vite.config.ts` (custom config managed by Lovable), and `src/styles.css` color values (unless adding a new semantic token). Do not add another root layout or `src/routes/_app/` folder.

## Open decisions before implementation

- Avatar storage: upload to Lovable Cloud Storage or use an external URL field for the first version? (Storage is cleaner; external URL is faster to prototype.)
- Should progress be derived on read from `user_progress` rows, or stored as a computed summary column that we update after each completed activity? (Derived on read is simpler; summary column is faster at scale.)
- Should the profile route be linked from a header on the existing study-areas hub, or only reachable by direct navigation for now?

## Acceptance criteria

- `/profile` redirects to `/auth` when the user is not signed in.
- Signed-in users see their saved name and avatar.
- Progress section shows overall completion, activities completed, and per-study-area progress.
- The page matches the existing dark theme and uses the same typography/spacing system.
- All database tables have proper GRANTs and RLS policies.
