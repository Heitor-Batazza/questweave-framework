import { useState } from "react";
import {
  createFileRoute,
  Link,
  notFound,
  useRouter,
} from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, Check, ChevronLeft, ChevronRight, Send } from "lucide-react";
import { getActivity } from "@/lib/navigation/structure";
import {
  AREA_ACCENT_VAR,
  getAreaPresentation,
} from "@/lib/navigation/presentation";
import { getActivityPresentation } from "@/lib/navigation/activity-presentation";
import { markActivityComplete } from "@/lib/profile.functions";
import { cn } from "@/lib/utils";


export const Route = createFileRoute("/activity/$activityId")({
  head: () => ({
    meta: [
      { title: "Exercise — English learning trails" },
      {
        name: "description",
        content:
          "Exercise layout with an explanation section, section switcher and answer area.",
      },
      { property: "og:title", content: "Exercise — English learning trails" },
      {
        property: "og:description",
        content:
          "Exercise layout with an explanation section, section switcher and answer area.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ActivityScreen,
});

const SECTIONS = [
  { id: "explanation", label: "Explanation" },
  { id: "example", label: "Example" },
  { id: "practice", label: "Practice" },
] as const;

function ActivityScreen() {
  const { activityId } = Route.useParams();
  const activity = getActivity(activityId);
  if (!activity) throw notFound();

  const router = useRouter();
  const markComplete = useServerFn(markActivityComplete);
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState("");
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const section = SECTIONS[step];

  async function handleComplete() {
    setCompleting(true);
    try {
      await markComplete({ data: { activityId } });
      setCompleted(true);
      await router.invalidate();
    } finally {
      setCompleting(false);
    }
  }


  return (
    <div
      className="min-h-screen bg-background"
      style={{ ["--exercise-accent" as string]: accent }}
    >
      <header className="sticky top-0 z-10 border-b border-border/70 backdrop-blur">
        <div className="mx-auto flex w-full max-w-2xl items-center gap-3 px-4 py-3 sm:px-6">
          <Link
            to="/trail/$trailId"
            params={{ trailId: activity.trailId }}
            aria-label="Back to trail"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border bg-card transition-colors hover:bg-secondary"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {area.name} · {p.label}
            </p>
            <h1 className="truncate text-base font-semibold">{p.name}</h1>
          </div>
          <span
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border bg-secondary"
            aria-hidden
          >
            <p.icon className="h-5 w-5" />
          </span>
        </div>
        <div className="mx-auto flex w-full max-w-2xl gap-1.5 px-4 pb-3 sm:px-6">
          {SECTIONS.map((s, i) => (
            <span
              key={s.id}
              className="h-1.5 flex-1 rounded-full transition-colors"
              style={{
                background:
                  i <= step ? "var(--exercise-accent)" : "var(--secondary)",
              }}
            />
          ))}
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl px-4 pb-28 pt-5 sm:px-6">
        <section
          className="rounded-3xl border border-border bg-card p-5"
          style={{ boxShadow: "var(--shadow-card)" }}
          aria-labelledby="section-title"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Section {step + 1} of {SECTIONS.length}
          </p>
          <h2 id="section-title" className="mt-1 text-lg font-semibold">
            {section.label}
          </h2>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p>
              Content placeholder for the {section.label.toLowerCase()} section.
              Text, audio players or reading passages will live here.
            </p>
            <div className="h-24 rounded-2xl border border-dashed border-border bg-secondary/40" />
          </div>
        </section>

        <section
          className="mt-4 rounded-3xl border border-border bg-card p-5"
          style={{ boxShadow: "var(--shadow-card)" }}
          aria-labelledby="question-title"
        >
          <h2 id="question-title" className="text-lg font-semibold">
            Question
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Question statement placeholder — no exercise content yet.
          </p>

          <label
            htmlFor="answer"
            className="mt-4 block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
          >
            Your answer
          </label>
          <textarea
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={4}
            placeholder="Type your answer here…"
            className="mt-2 w-full resize-none rounded-2xl border border-border bg-secondary/40 p-3 text-sm outline-none transition-colors focus:border-[color-mix(in_oklab,var(--exercise-accent)_55%,transparent)]"
          />

          <button
            type="button"
            disabled={!answer.trim()}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-background transition-transform duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            style={{ background: "var(--exercise-accent)" }}
          >
            <Send className="h-4 w-4" />
            Check answer
          </button>
        </section>
      </main>

      <nav className="fixed inset-x-0 bottom-0 border-t border-border/70 bg-background/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-secondary",
              "disabled:cursor-not-allowed disabled:opacity-40",
            )}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          <span className="text-xs text-muted-foreground">{section.label}</span>
          <button
            type="button"
            onClick={() =>
              setStep((s) => Math.min(SECTIONS.length - 1, s + 1))
            }
            disabled={step === SECTIONS.length - 1}
            className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-background transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            style={{ background: "var(--exercise-accent)" }}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </nav>
    </div>
  );
}
