import { type NextPage } from "next"
import Head from "next/head"

const SinglePostPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Post</title>
      </Head>
      <main className="flex min-h-screen justify-center">
        <div>Single Post</div>
      </main>
    </>
  )
}

export default SinglePostPage
