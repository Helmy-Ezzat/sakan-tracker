import webpush from "web-push";

let configured = false;

export function configureWebPush(): void {
  if (configured) return;

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject =
    process.env.VAPID_SUBJECT ?? "mailto:support@sakan-tracker.local";

  if (!publicKey || !privateKey) {
    throw new Error(
      "Missing VAPID keys. Run: npx web-push generate-vapid-keys and add to .env.local",
    );
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);
  configured = true;
}

export function isPushConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY,
  );
}
