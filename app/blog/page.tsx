import { Suspense } from "react"
import { getServerSession } from 'next-auth'

import { authOptions } from "@/lib/auth";

import Loader from "@/components/Loader";
import BlogPage from '@/components/BlogPage';
import { BlogView } from '@/components/BlogView';

export default async function Blog() {
  const session = await getServerSession(authOptions)

  return (
    <Suspense fallback={<Loader />}>
      <BlogPage
        currentView={BlogView.LIST}
        session={session} />
    </Suspense>
  )
}