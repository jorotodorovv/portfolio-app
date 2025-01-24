import { Suspense } from 'react';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';

import Loader from '@/components/Loader'
import BlogPage from '@/components/BlogPage';
import { BlogView } from '@/components/BlogView';

export default async function BlogPost({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  return (
    <Suspense fallback={<Loader />}>
      <BlogPage currentView={BlogView.CONTENT} session={session} postId={params.id} />
    </Suspense>
  )
}

