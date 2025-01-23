import BlogList, { Post } from "@/components/BlogList"
import Loader from "@/components/Loader";
import { Suspense } from "react"

async function fetchPosts() {
  const baseUrl = `http://localhost:3000`;
  const response = await fetch(`${baseUrl}/api/posts`);
  if (!response.ok) {
      throw new Error('Failed to fetch posts');
  }
  const result = await response.json();
  return result.posts;
}

export default async function Blog() {
  const posts: Post[] = await fetchPosts();

  return (
    <Suspense fallback={<Loader />}>
      <BlogList posts={posts} />
    </Suspense>
  )
}

