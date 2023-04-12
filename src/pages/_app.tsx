import { type AppType } from "next/app"
import { ClerkProvider } from "@clerk/nextjs"

import { api } from "~/utils/api"

import "~/styles/globals.css"
import { Toaster } from "react-hot-toast"
import Head from "next/head"

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <Head>
        <title>Chirp</title>
        <meta name="description" content="☁️" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Toaster position="bottom-right" />
      <Component {...pageProps} />
    </ClerkProvider>
  )
}

export default api.withTRPC(MyApp)
