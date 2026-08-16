import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const profileSchema = z.object({
  displayName: z.string().trim().max(100).optional(),
  avatarUrl: z.string().trim().url().max(500).optional().or(z.literal("")),
});

const activityIdSchema = z.object({
  activityId: z.string().min(1),
});

export const getProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, user_id, display_name, avatar_url, created_at, updated_at")
      .eq("user_id", userId)
      .single();

    if (profile) {
      return {
        id: profile.id,
        userId: profile.user_id,
        displayName: profile.display_name ?? "",
        avatarUrl: profile.avatar_url ?? "",
        createdAt: profile.created_at,
        updatedAt: profile.updated_at,
      };
    }

    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    const defaultName =
      user.user?.user_metadata?.["full_name"] ??
      user.user?.email?.split("@")[0] ??
      "";

    const { data: created, error: insertError } = await supabase
      .from("profiles")
      .insert({
        user_id: userId,
        display_name: defaultName,
        avatar_url: "",
      })
      .select("id, user_id, display_name, avatar_url, created_at, updated_at")
      .single();

    if (insertError || !created) throw insertError ?? new Error("Profile creation failed");

    return {
      id: created.id,
      userId: created.user_id,
      displayName: created.display_name ?? "",
      avatarUrl: created.avatar_url ?? "",
      createdAt: created.created_at,
      updatedAt: created.updated_at,
    };
  });

export const updateProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => profileSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", userId)
      .single();

    const update = {
      display_name: data.displayName,
      avatar_url: data.avatarUrl || null,
    };

    if (!existing) {
      const { data: created, error } = await supabase
        .from("profiles")
        .insert({ user_id: userId, ...update })
        .select("id, user_id, display_name, avatar_url, created_at, updated_at")
        .single();

      if (error || !created) throw error ?? new Error("Profile creation failed");
      return {
        id: created.id,
        userId: created.user_id,
        displayName: created.display_name ?? "",
        avatarUrl: created.avatar_url ?? "",
        createdAt: created.created_at,
        updatedAt: created.updated_at,
      };
    }

    const { data: updated, error } = await supabase
      .from("profiles")
      .update(update)
      .eq("user_id", userId)
      .select("id, user_id, display_name, avatar_url, created_at, updated_at")
      .single();

    if (error || !updated) throw error ?? new Error("Profile update failed");

    return {
      id: updated.id,
      userId: updated.user_id,
      displayName: updated.display_name ?? "",
      avatarUrl: updated.avatar_url ?? "",
      createdAt: updated.created_at,
      updatedAt: updated.updated_at,
    };
  });

export const getUserProgress = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data, error } = await supabase
      .from("user_progress")
      .select("activity_id, state")
      .eq("user_id", userId);

    if (error) throw error;

    return (data ?? []).map((row) => ({
      activityId: row.activity_id,
      state: row.state,
    }));
  });

export const markActivityComplete = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => activityIdSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { error } = await supabase.from("user_progress").upsert(
      {
        user_id: userId,
        activity_id: data.activityId,
        state: "completed",
        completed_at: new Date().toISOString(),
      },
      { onConflict: "user_id, activity_id" },
    );

    if (error) throw error;

    return { ok: true };
  });
