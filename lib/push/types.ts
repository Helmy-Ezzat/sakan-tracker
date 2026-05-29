export type PushSubscriptionInput = {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
};

export type ExpensePushPayload = {
  title: string;
  body: string;
  tag: string;
  url: string;
};
