import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getProfile, updateProfile } from "@/lib/profile.functions";
import { getProgressStats } from "@/lib/progress.functions";
import { AREA_ACCENT_VAR } from "@/lib/navigation/presentation";
import { User, LogOut, Save, Camera } from "lucide-react";

const profileQueryOptions = queryOptions({
  queryKey: ["profile"],
  queryFn: () => getProfile(),
  staleTime: 60_000,
});

const progressQueryOptions = queryOptions({
  queryKey: ["progressStats"],
  queryFn: () => getProgressStats(),
  staleTime: 60_000,
});

export const Route = createFileRoute("/profile")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Your profile — English learning trails" },
      { name: "description", content: "View your profile, progress, and achievements." },
      { property: "og:title", content: "Your profile — English learning trails" },
      { property: "og:description", content: "View your profile, progress, and achievements." },
    ],
  }),
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({ to: "/auth" });
    }
    return { user: data.user };
  },
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(profileQueryOptions);
    context.queryClient.ensureQueryData(progressQueryOptions);
  },
  component: ProfilePage,
});

function ProfilePage() {
  const { data: profile } = useSuspenseQuery(profileQueryOptions);
  const { data: stats } = useSuspenseQuery(progressQueryOptions);
  const router = useRouter();

  const [displayName, setDisplayName] = useState(profile.displayName);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    await updateProfile({ data: { displayName, avatarUrl } });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.navigate({ to: "/" });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border" style={{ background: "var(--gradient-hero)" }}>
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
          <h1 className="text-xl font-bold sm:text-2xl">Profile</h1>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/70 px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-card"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-6 sm:px-8 sm:py-10">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-surface-2">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-10 w-10 text-muted-foreground" />
              )}
              <div className="absolute bottom-0 right-0 rounded-tl-lg bg-card p-1">
                <Camera className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground">
                  Display name
                </label>
                <input
                  id="name"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="avatar" className="block text-sm font-medium text-foreground">
                  Avatar URL
                </label>
                <input
                  id="avatar"
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {saving ? "Saving..." : "Save profile"}
                </button>
                {saved && (
                  <span className="text-sm text-success">Saved!</span>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="text-lg font-semibold text-foreground">Overall progress</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <StatCard label="Activities completed" value={stats.completedActivities} />
            <StatCard label="Total activities" value={stats.totalActivities} />
            <StatCard label="Overall completion" value={`${stats.overallPercent}%`} />
          </div>

          <div className="mt-6">
            <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${stats.overallPercent}%` }}
              />
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="text-lg font-semibold text-foreground">Progress by area</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {stats.perArea.map((area) => (
              <div
                key={area.areaId}
                className="rounded-xl border border-border bg-background p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium text-foreground">{area.title}</span>
                  <span className="text-sm text-muted-foreground">
                    {area.completed}/{area.total}
                  </span>
                </div>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${area.percent}%`,
                      backgroundColor: AREA_ACCENT_VAR[area.accentIndex] ?? AREA_ACCENT_VAR[1],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="text-lg font-semibold text-foreground">Achievements</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Achievements and streaks will appear here in a future update.
          </p>
        </section>
      </main>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border bg-background p-4 text-center">
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
