import { createAdminClient } from "@/lib/supabase/admin";
import type { PushSubscriptionInput } from "@/lib/push/types";

export type StoredPushSubscription = {
  id: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth_key: string;
};

export async function upsertPushSubscription(
  userId: string,
  subscription: PushSubscriptionInput,
): Promise<void> {
  const supabase = createAdminClient();

  const { error } = await supabase.from("push_subscriptions").upsert(
    {
      user_id: userId,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth_key: subscription.keys.auth,
    },
    { onConflict: "endpoint" },
  );

  if (error) throw error;
}

export async function deletePushSubscription(endpoint: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("push_subscriptions")
    .delete()
    .eq("endpoint", endpoint);
  if (error) throw error;
}

export async function getPushSubscriptionsForSession(
  sessionId: string,
  excludeUserId: string,
): Promise<StoredPushSubscription[]> {
  const supabase = createAdminClient();

  const { data: members, error: membersError } = await supabase
    .from("session_members")
    .select("user_id")
    .eq("session_id", sessionId)
    .neq("user_id", excludeUserId);

  if (membersError) throw membersError;

  const userIds = (members ?? []).map((m) => m.user_id);
  if (userIds.length === 0) return [];

  const { data, error } = await supabase
    .from("push_subscriptions")
    .select("*")
    .in("user_id", userIds);

  if (error) throw error;
  return (data ?? []) as StoredPushSubscription[];
}
