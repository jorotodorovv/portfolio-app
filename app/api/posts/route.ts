import { NextResponse } from 'next/server'
import { writeFile, readFile } from 'fs/promises'
import path from 'path'

// Path to the JSON file
const postsFilePath = path.join(process.cwd(), 'content/posts.json')

// Function to read posts from the JSON file
async function readPosts() {
  const data = await readFile(postsFilePath, 'utf-8')
  return JSON.parse(data)
}

// Function to write posts to the JSON file
async function writePosts(posts: any[]) {
  await writeFile(postsFilePath, JSON.stringify(posts, null, 2))
}

export async function POST(request: Request) {
  const { title, content, tags, fileName } = await request.json();
  
  const filePath = path.join(process.cwd(), 'content', fileName)

  let readTime = Math.ceil(content.split(' ').length / 200)
  let excerpt = content.substring(0, 100);

  // Write the content to the Markdown file
  await writeFile(filePath, content)

  // Read existing posts from the JSON file
  const posts = await readPosts()

  // Create a new post object
  const newPost = {
    id: (posts.length + 1).toString(),
    title,
    excerpt, // Example excerpt from content
    content: `content/${fileName}`,
    date: new Date().toISOString().split('T')[0],
    readTime,
    tags: tags.split(',').map(tag => tag.trim())
  }

  // Add the new post to the posts array
  posts.push(newPost)

  // Write the updated posts back to the JSON file
  await writePosts(posts)

  // Return a success response
  return NextResponse.json({ message: 'Post created successfully', post: newPost })
}
