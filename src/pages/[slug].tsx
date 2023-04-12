import type { GetStaticProps, NextPage } from "next"
import Head from "next/head"
import { api } from "../utils/api"

import { createServerSideHelpers } from "@trpc/react-query/server"
import { appRouter } from "../server/api/root"
import { prisma } from "~/server/db"
import superjson from "superjson"
import { PageLayout } from "../components/layout"
import Image from "next/image"
import { LoadingPage } from "../components/Loading"
import { PostView } from "../components/PostView"

const ProfileFeed = (props: { userId: string }) => {
  const { data, isLoading } = api.posts.getPostsByUserId.useQuery({
    userId: props.userId,
  })

  if (isLoading) return <LoadingPage />
  if (!data || data.length === 0) return <div>User has not posted</div>
  return (
    <div className="flex flex-col">
      {data?.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  )
}

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data } = api.profile.getUserbyUsername.useQuery({
    username,
  })

  if (!data) return <div>404</div>

  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>
      <PageLayout>
        <div className=" relative h-36   bg-slate-600">
          <Image
            src={data.profilePictureUrl}
            alt={`${data.username ?? ""}'s profile pic`}
            className="absolute  bottom-0 left-0 -mb-[64px] ml-4  rounded-full border-4 border-black bg-black"
            width="128"
            height="128"
          />
        </div>
        <div className="h-[64px]"></div>
        <div className="border-b border-slate-400 p-4  text-2xl font-bold">{`@${
          data.username ?? ""
        }`}</div>
        <div className="">
          <ProfileFeed userId={data.id} />
        </div>
      </PageLayout>
    </>
  )
}

export default ProfilePage

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson, // optional - adds superjson serialization
  })

  const slug = context.params?.slug
  if (typeof slug !== "string") throw new Error("no slug")
  const username = slug.replace("@", "")

  await ssg.profile.getUserbyUsername.prefetch({ username })
  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  }
}

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  }
}
