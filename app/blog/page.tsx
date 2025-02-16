import { Suspense } from "react"
import { getServerSession } from 'next-auth'

import { authOptions } from "@/lib/auth";

import Loader from "@/components/Loader";
import BlogPage from '@/components/BlogPage';
import { BlogView } from '@/components/BlogView';
import { Post } from "@/components/BlogList";
import { fetchData, FetchEndpoints } from "@/endpoints/core";

interface PostResponse {
  posts: Post[];
}

export default async function Blog() {
  const session = await getServerSession(authOptions)

  const response: PostResponse = await fetchData(FetchEndpoints.POSTS);

  return (
    <Suspense fallback={<Loader />}>
      <BlogPage
        initialPosts={response.posts}
        currentView={BlogView.LIST}
        session={session} />
    </Suspense>
  )
}