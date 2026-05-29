declare module "web-push" {
  export type PushSubscription = {
    endpoint: string;
    keys: { p256dh: string; auth: string };
  };

  export function setVapidDetails(
    subject: string,
    publicKey: string,
    privateKey: string,
  ): void;

  export function sendNotification(
    subscription: PushSubscription,
    payload?: string | Buffer | null,
    options?: Record<string, unknown>,
  ): Promise<void>;

  export function generateVAPIDKeys(): { publicKey: string; privateKey: string };
}
