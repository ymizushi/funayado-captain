type Config = {
  pusher: {
    appId: string,
    key: string,
    secret: string,
    cluster: string,
  }
}

const assertIsSetEnv = (id: string): string => {
  const env = process.env[id]
  if (env) {
    return env
  } else {
    throw new Error(`${id} is not set to Environment Variable`)
  }
}

export const config: Config = 
  {
    pusher: {
      appId: assertIsSetEnv('PUSHER_APP_ID'),
      key: assertIsSetEnv('NEXT_PUBLIC_PUSHER_KEY'),
      secret: assertIsSetEnv('PUSHER_SECRET'),
      cluster: assertIsSetEnv('NEXT_PUBLIC_PUSHER_CLUSTER'),
    }
  }