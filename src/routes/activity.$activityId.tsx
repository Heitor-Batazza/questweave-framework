import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { getActivity } from "@/lib/navigation/structure";
import {
  AREA_ACCENT_VAR,
  getAreaPresentation,
} from "@/lib/navigation/presentation";

export const Route = createFileRoute("/activity/$activityId")({
  head: () => ({
    meta: [
      { title: "Activity — English learning trails" },
      {
        name: "description",
        content: "Placeholder activity screen showing only its identifier.",
      },
      { property: "og:title", content: "Activity — English learning trails" },
      {
        property: "og:description",
        content: "Placeholder activity screen showing only its identifier.",
      },
    ],
  }),
  component: ActivityScreen,
});

function ActivityScreen() {
  const { activityId } = Route.useParams();
  const activity = getActivity(activityId);
  if (!activity) throw notFound();

  const p = getAreaPresentation(activity.studyAreaId);
  const accent = AREA_ACCENT_VAR[p.accent];

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex w-full max-w-3xl items-center gap-3 px-4 py-3 sm:px-6">
        <Link
          to="/trail/$trailId"
          params={{ trailId: activity.trailId }}
          aria-label="Back to trail"
          className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-card transition-colors hover:bg-secondary"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <span className="truncate text-sm text-muted-foreground">{p.name}</span>
      </header>

      <main className="mx-auto grid w-full max-w-md place-items-center px-5 py-16 text-center">
        <div
          className="w-full rounded-3xl border border-border bg-card p-8"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <span
            className="inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-background"
            style={{ background: accent }}
          >
            {activity.kind}
          </span>
          <h1 className="mt-4 font-mono text-2xl font-bold">{activity.id}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Position #{activity.order} · {activity.state.replace("_", " ")}
          </p>
          <p className="mt-6 text-sm text-muted-foreground">
            Empty placeholder screen. No content here yet.
          </p>
        </div>
      </main>
    </div>
  );
}