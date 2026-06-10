"use client"

import BlogCard, { type BlogPostCard } from "./BlogCard"

interface BlogGridProps {
  posts: BlogPostCard[]
  isLoading?: boolean
}

function SkeletonCard() {
  return (
    <div className="flex flex-col bg-white border border-[#ede8e0] animate-pulse">
      <div className="w-full bg-[#e8e0d5]" style={{ aspectRatio: "4/3" }} />
      <div className="px-4 pt-5 pb-5 space-y-3">
        <div className="h-4 bg-[#e8e0d5] rounded w-4/5" />
        <div className="h-4 bg-[#e8e0d5] rounded w-3/5" />
        <div className="h-3 bg-[#ede8e0] rounded w-full" />
        <div className="h-3 bg-[#ede8e0] rounded w-4/5" />
        <div className="flex items-center gap-2 pt-1">
          <div className="h-[1.5px] w-6 bg-[#e0d8cc]" />
          <div className="h-3 w-16 bg-[#e8e0d5] rounded" />
        </div>
      </div>
    </div>
  )
}

export default function BlogGrid({ posts, isLoading = false }: BlogGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      {isLoading
        ? [0, 1, 2, 3, 4, 5].map(i => <SkeletonCard key={i} />)
        : posts.map(post => <BlogCard key={post.id} post={post} />)}
    </div>
  )
}