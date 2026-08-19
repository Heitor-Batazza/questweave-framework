import { createFileRoute, Link } from "@tanstack/react-router";
import { User } from "lucide-react";
import { navigationStructure } from "@/lib/navigation/structure";
import { isAreaUnlocked } from "@/lib/navigation/presentation";
import { AreaCard } from "@/components/study-areas/AreaCard";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Study areas — English learning trails" },
      {
        name: "description",
        content:
          "Browse study areas, track progress, and jump into the learning trail of each area.",
      },
      { property: "og:title", content: "Study areas — English learning trails" },
      {
        property: "og:description",
        content:
          "Browse study areas, track progress, and jump into the learning trail of each area.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { studyAreas, activities } = navigationStructure;
  const unlockedCount = studyAreas.filter((a) => isAreaUnlocked(a.id)).length;

  return (
    <div className="min-h-screen bg-background">
      <header
        className="grid-backdrop relative overflow-hidden border-b border-border"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="mx-auto w-full max-w-5xl px-5 pb-8 pt-10 sm:px-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Your library
              </p>
              <h1 className="mt-2 text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
                Study areas.
                <span className="block text-primary">Sua trilha.</span>
              </h1>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Pick an area and follow its trail. Placeholder content — structure only.
              </p>
            </div>
            <Link
              to="/profile"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <User className="h-4 w-4" />
              Profile
            </Link>
          </div>
          <div className="mt-5 flex flex-wrap gap-2 text-xs">
            <Stat label="areas" value={studyAreas.length} />
            <Stat label="unlocked" value={unlockedCount} />
            <Stat label="activities" value={activities.length} />
          </div>
        </div>

      </header>

      <main className="mx-auto w-full max-w-5xl px-5 py-6 sm:px-8 sm:py-10">
        <div className="grid gap-4 sm:grid-cols-2">
          {studyAreas.map((area) => (
            <AreaCard key={area.id} area={area} />
          ))}
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 font-medium">
      <span className="font-semibold text-foreground">{value}</span>
      <span className="text-muted-foreground">{label}</span>
    </span>
  );
}
