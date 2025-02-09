"use client";

import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Post } from './BlogList';
import Markdown from './base/Markdown';

interface BlogContentProps {
  post: Post;
  userId: string;
  onDelete: (postId: string, refresh: boolean) => void;
}

const BlogContent = ({ post, userId, onDelete }: BlogContentProps) => {
  return (
    <>
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <div className="flex justify-between items-center text-sm text-gray-500 mb-8">
        <span>{formatDistanceToNow(new Date(post.date), { addSuffix: true })}</span>
        <span>{post.readTime} min read</span>
      </div>
      <Markdown content={post.content} />
      <div className="mt-8">
        {post.tags.map((tag) => (
          <span key={tag.id} className="inline-block bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-200 mr-2 mb-2">
            {tag.name}
          </span>
        ))}
      </div>
      {post.user.id === userId && (
        <button onClick={() => onDelete(post.id, true)} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
          Delete Post
        </button>
      )}
    </>
  );
};

export default BlogContent;