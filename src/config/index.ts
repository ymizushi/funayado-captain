type PublicConfig = {
  pusher: {
    key: string,
    cluster: string,
  }
}

type PrivateConfig = {
  pusher: {
    appId: string,
    secret: string,
  }
}

export const publicConfig = (): PublicConfig => {
  return {
    pusher: {
      key: process.env.NEXT_PUBLIC_PUSHER_KEY ?? "",
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER ?? "",
    }
  }
}

export const privateConfig = (): PrivateConfig => {
  return {
    pusher: {
      appId: process.env.PUSHER_APP_ID ?? "",
      secret: process.env.PUSHER_SECRET ?? "",
    }
  }
}