import { Suspense } from 'react';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';

import Loader from '@/components/Loader'
import BlogPage from '@/components/BlogPage';
import { BlogView } from '@/components/BlogView';
import { Post } from '@/components/BlogList';
import { fetchData, FetchEndpoints } from '@/endpoints/core';

interface PostResponse {
  posts: Post[];
}

export default async function BlogPost({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  const response: PostResponse = await fetchData([FetchEndpoints.POSTS, params.id].join('/'));

  return (
    <Suspense fallback={<Loader />}>
      <BlogPage
        initialPosts={response.posts}
        currentView={BlogView.CONTENT}
        session={session}
        postUrl={params.id} />
    </Suspense>
  )
}

