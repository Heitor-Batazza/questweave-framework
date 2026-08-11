import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { getTrail, getTrailActivities } from "@/lib/navigation/structure";
import {
  AREA_ACCENT_VAR,
  getAreaPresentation,
} from "@/lib/navigation/presentation";
import { TrailPath } from "@/components/trail/TrailPath";

export const Route = createFileRoute("/trail/$trailId")({
  head: () => ({
    meta: [
      { title: "Trail — English learning trails" },
      {
        name: "description",
        content: "Follow the winding trail of activities inside a study area.",
      },
      { property: "og:title", content: "Trail — English learning trails" },
      {
        property: "og:description",
        content: "Follow the winding trail of activities inside a study area.",
      },
    ],
  }),
  component: TrailScreen,
});

function TrailScreen() {
  const { trailId } = Route.useParams();
  const trail = getTrail(trailId);
  if (!trail) throw notFound();

  const activities = getTrailActivities(trail.id);
  const p = getAreaPresentation(trail.studyAreaId);
  const accent = AREA_ACCENT_VAR[p.accent];
  const completed = activities.filter((a) => a.state === "completed").length;

  return (
    <div className="min-h-screen bg-background">
      <header
        className="sticky top-0 z-10 border-b border-border/70 backdrop-blur"
        style={{
          background:
            "color-mix(in oklab, var(--background) 82%, transparent)",
        }}
      >
        <div className="mx-auto grid w-full max-w-3xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6">
          <Link
            to="/"
            aria-label="Back to study areas"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border bg-card transition-colors hover:bg-secondary"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold sm:text-lg">
              {p.name}
            </h1>
            <p className="truncate text-xs text-muted-foreground">
              trail {trail.id} · {activities.length} activities
            </p>
          </div>
          <span
            className="shrink-0 rounded-full px-3 py-1 text-xs font-semibold text-background"
            style={{ background: accent }}
          >
            {completed}/{activities.length}
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl px-6 pb-16 pt-2 sm:px-10 sm:px-6">
        <TrailPath activities={activities} accent={accent} />
      </main>
    </div>
  );
}