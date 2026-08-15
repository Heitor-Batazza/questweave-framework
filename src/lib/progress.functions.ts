import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { navigationStructure } from "@/lib/navigation/structure";
import { getAreaPresentation } from "@/lib/navigation/presentation";


export interface ProgressStats {
  totalActivities: number;
  completedActivities: number;
  overallPercent: number;
  perArea: {
    areaId: string;
    title: string;
    total: number;
    completed: number;
    percent: number;
    accentIndex: number;
  }[];
}

export const getProgressStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data: progressRows, error } = await supabase
      .from("user_progress")
      .select("activity_id, state")
      .eq("user_id", userId);

    if (error) throw error;

    const completedIds = new Set(
      (progressRows ?? [])
        .filter((r) => r.state === "completed")
        .map((r) => r.activity_id),
    );

    const totalActivities = navigationStructure.activities.length;
    const completedActivities = completedIds.size;
    const overallPercent = totalActivities
      ? Math.round((completedActivities / totalActivities) * 100)
      : 0;

    const perArea = navigationStructure.studyAreas.map((area) => {
      const presentation = getAreaPresentation(area.id);
      const trail = navigationStructure.trails.find((t) => t.studyAreaId === area.id);
      const activityIds = trail ? trail.activityIds : [];
      const total = activityIds.length;
      const completed = activityIds.filter((id) => completedIds.has(id)).length;
      const percent = total ? Math.round((completed / total) * 100) : 0;

      return {
        areaId: area.id,
        title: presentation.name,
        total,
        completed,
        percent,
        accentIndex: presentation.accent,
      };
    });


    return {
      totalActivities,
      completedActivities,
      overallPercent,
      perArea,
    } satisfies ProgressStats;
  });
