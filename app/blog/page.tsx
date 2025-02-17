import { Suspense } from "react"
import { getServerSession } from 'next-auth'

import { authOptions } from "@/lib/auth";

import Loader from "@/components/Loader";
import BlogPage from '@/components/BlogPage';
import { BlogView } from '@/components/BlogView';
import { getPosts, PostEntity } from "@/server/posts";

export default async function Blog() {
  const session = await getServerSession(authOptions)

  const posts: PostEntity[] = await getPosts();

  return (
    <Suspense fallback={<Loader />}>
      <BlogPage
        initialPosts={posts}
        currentView={BlogView.LIST}
        session={session} />
    </Suspense>
  )
}