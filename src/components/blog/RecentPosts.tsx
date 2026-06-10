"use client"

import Link from "next/link"

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
export interface RecentPost {
  id: string | number
  slug: string
  title: string
  image: string
  publishedAt?: string
}

interface RecentPostsProps {
  posts?: RecentPost[]
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function formatDate(date?: string) {
  if (!date) return ""

  try {
    return new Date(date).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    })
  } catch {
    return ""
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function RecentPosts({
  posts = [],
}: RecentPostsProps) {

  // Empty state
  if (!posts.length) {
    return (
      <div className="mb-8">
        <h3
          className="text-[15px] font-semibold text-[#1e1510] mb-4"
          style={{ fontFamily: "'Playfair Display',serif" }}
        >
          Recent Posts
        </h3>

        <div
          className="border border-dashed border-[#ddd] p-4 text-center text-[12px] text-[#999]"
          style={{ fontFamily: "'Montserrat',sans-serif" }}
        >
          Chưa có bài viết gần đây.
        </div>
      </div>
    )
  }

  return (
    <div className="mb-8">
      <h3
        className="text-[15px] font-semibold text-[#1e1510] mb-4"
        style={{ fontFamily: "'Playfair Display',serif" }}
      >
        Recent Posts
      </h3>

      <ul className="space-y-4">
        {posts.map((post) => {
          const href = `/blog/${post.slug}`

          return (
            <li key={post.id}>
              <Link
                href={href}
                className="group flex items-start gap-3"
              >
                {/* Thumbnail */}
                <div className="h-[52px] w-[64px] shrink-0 overflow-hidden bg-[#f3f3f3]">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover group-hover:scale-105"
                    style={{ transition: "transform 0.3s ease" }}
                    loading="lazy"
                  />
                </div>

                {/* Text */}
                <div className="flex flex-col justify-center min-w-0">
                  <span
                    className="line-clamp-2 text-[12px] leading-snug text-[#3a3530] group-hover:text-[#9e8060]"
                    style={{
                      fontFamily: "'Montserrat',sans-serif",
                      transition: "color 0.2s",
                    }}
                  >
                    {post.title}
                  </span>

                  {post.publishedAt && (
                    <span
                      className="mt-[2px] text-[10px] text-[#aaa]"
                      style={{ fontFamily: "'Montserrat',sans-serif" }}
                    >
                      {formatDate(post.publishedAt)}
                    </span>
                  )}
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}