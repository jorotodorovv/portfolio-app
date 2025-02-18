import { Suspense } from 'react';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';

import Loader from '@/components/Loader'
import BlogPage from '@/components/BlogPage';
import { BlogView } from '@/components/BlogView';
import { getPost, PostEntity } from '@/server/posts';

export default async function BlogPost({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  const post: PostEntity = await getPost(params.id);

  return (
    <Suspense fallback={<Loader />}>
      <BlogPage
        initialPosts={[post]}
        currentView={BlogView.CONTENT}
        session={session}
        postUrl={params.id} />
    </Suspense>
  )
}

