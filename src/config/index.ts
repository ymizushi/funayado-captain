type PublicConfig = {
  pusher: {
    key: string;
    cluster: string;
  };
};

type PrivateConfig = {
  pusher: {
    appId: string;
    secret: string;
  };
};

export const publicConfig: PublicConfig = {
  pusher: {
    key: process.env.NEXT_PUBLIC_PUSHER_KEY ?? "",
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER ?? "",
  },
};

export const privateConfig: PrivateConfig = {
  pusher: {
    appId: process.env.PUSHER_APP_ID ?? "",
    secret: process.env.PUSHER_SECRET ?? "",
  },
};
