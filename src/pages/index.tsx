import { type NextPage } from "next"
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs"

import { api } from "~/utils/api"

import dayjs from "dayjs"
import relativeTIme from "dayjs/plugin/relativeTime"
import Image from "next/image"
import { Loading, LoadingPage } from "../components/Loading"
import { useState } from "react"
import { toast } from "react-hot-toast"

import { PageLayout } from "../components/layout"
import { PostView } from "../components/PostView"

dayjs.extend(relativeTIme)

const CreatePostWizard = () => {
  const { user } = useUser()
  const [input, setInput] = useState("")

  const ctx = api.useContext()
  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("")
      void ctx.posts.getAll.invalidate()
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0])
      } else {
        toast.error("Failed to post! Please try again later")
      }
    },
  })

  if (!user) return null
  return (
    <div className="flex w-full gap-3">
      <Image
        src={user.profileImageUrl}
        alt="Profile Image"
        className="h-14 w-14 rounded-full"
        width="56"
        height="56"
      />
      <input
        placeholder="Type some emoji"
        className="grow bg-transparent outline-none"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault()
            if (input !== "") {
              mutate({ content: input })
            }
          }
        }}
        disabled={isPosting}
      />
      {input !== "" && !isPosting && (
        <button
          onClick={() => {
            mutate({ content: input })
          }}
        >
          Post
        </button>
      )}
      {isPosting && (
        <div className=" flex items-center justify-center">
          <Loading size={20} />
        </div>
      )}
    </div>
  )
}

const Feed = () => {
  const { data, isLoading: postLoading } = api.posts.getAll.useQuery()

  if (postLoading) return <LoadingPage />

  if (!data) return <div>Something went wrong</div>

  return (
    <div className="flex flex-col">
      {data?.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  )
}

const Home: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser()

  // start fetching ASAP
  api.posts.getAll.useQuery()

  // return empty div if both are not loaded since user tends to load faster
  if (!userLoaded) return <div></div>

  return (
    <PageLayout>
      <div className="flex border-b border-slate-400 p-4">
        {!isSignedIn && (
          <div className="flex w-full justify-center">
            <SignInButton />
          </div>
        )}
        {!!isSignedIn && (
          <div className="flex w-full justify-center">
            <CreatePostWizard />
            <SignOutButton />
          </div>
        )}
      </div>
      <Feed />
    </PageLayout>
  )
}

export default Home
