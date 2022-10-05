import 'styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'

function MyApp({ Component, pageProps }: AppProps) {
  return <>
      <Head>
        <title>funayado-captain</title>
        <link href="https://fonts.googleapis.com/earlyaccess/nicomoji.css" rel="stylesheet" />
      </Head>
      <Component {...pageProps} />
    </>
}

export default MyApp
