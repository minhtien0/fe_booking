"use client"

import { useState } from "react"
import Link from "next/link"

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
export interface BlogCategory {
  id: string | number
  name: string
  slug: string
}

export interface BlogTag {
  id: string | number
  name: string
  slug: string
}

export interface BlogPostDetail {
  id: string | number
  slug: string
  title: string
  excerpt: string
  coverImage: string
  readTime?: string
  status?: string
  publishedAt?: string
  content: BlogContentBlock[]
  category: BlogCategory
  author: {
    id: string | number
    name: string
    avatar?: string
    role?: string
  }
  tags?: BlogTag[]
}

export type BlogContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "quote"; text: string; author?: string }
  | { type: "list"; style: "bullet" | "ordered"; items: string[] }
  | { type: "divider" }
  | { type: "tip"; text: string }

// ─────────────────────────────────────────────────────────────────────────────
// BREADCRUMB
// ─────────────────────────────────────────────────────────────────────────────
function Breadcrumb({
  category,
  title,
}: {
  category: BlogCategory
  title: string
}) {
  return (
    <nav
      className="mb-8 flex flex-wrap items-center gap-2"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      <Link
        href="/"
        className="text-[11px] uppercase tracking-[1.5px] text-[#9e8060] hover:text-[#7a6248]"
        style={{ transition: "color .2s" }}
      >
        Trang Chủ
      </Link>
      <span className="text-[11px] text-[#ccc]">/</span>

      <Link
        href="/blog"
        className="text-[11px] uppercase tracking-[1.5px] text-[#9e8060] hover:text-[#7a6248]"
        style={{ transition: "color .2s" }}
      >
        Tin Tức
      </Link>
      <span className="text-[11px] text-[#ccc]">/</span>

      <Link
        href={`/blog?category=${encodeURIComponent(category.slug)}`}
        className="text-[11px] uppercase tracking-[1.5px] text-[#9e8060] hover:text-[#7a6248]"
        style={{ transition: "color .2s" }}
      >
        {category.name}
      </Link>

      <span className="text-[11px] text-[#ccc]">/</span>
      <span className="max-w-[160px] truncate text-[11px] uppercase tracking-[1.5px] text-[#aaa]">
        {title}
      </span>
    </nav>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTHOR CARD
// ─────────────────────────────────────────────────────────────────────────────
function AuthorCard({
  author,
  date,
  readTime,
}: {
  author: BlogPostDetail["author"]
  date: string
  readTime?: string
}) {
  return (
    <div className="mb-8 flex items-center gap-4 border-y border-[#ede8e0] py-5">
      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-[#e8e0d5]">
        {author.avatar ? (
          <img
            src={author.avatar}
            alt={author.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#9e8060]">
            <span
              className="text-[15px] font-bold text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {author.name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p
          className="text-[13px] font-semibold text-[#2c1f14]"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          {author.name}
        </p>
        {author.role && (
          <p
            className="text-[11px] uppercase tracking-[1px] text-[#9e8060]"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            {author.role}
          </p>
        )}
      </div>

      <div className="shrink-0 text-right">
        <p className="text-[12px] text-[#7a6e62]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          {date}
        </p>
        {readTime && (
          <p className="text-[11px] text-[#aaa]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {readTime}
          </p>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTENT BLOCK RENDERER
// ─────────────────────────────────────────────────────────────────────────────
function ContentBlock({ block }: { block: BlogContentBlock }) {
  switch (block.type) {
    case "heading":
      return block.level === 2 ? (
        <h2
          className="mb-4 mt-10 text-[22px] font-light leading-snug text-[#1e1510] md:text-[26px]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {block.text}
        </h2>
      ) : (
        <h3
          className="mb-3 mt-8 text-[18px] font-semibold leading-snug text-[#2c1f14]"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          {block.text}
        </h3>
      )

    case "paragraph":
      return (
        <p
          className="mb-5 text-[14px] leading-[1.95] text-[#5a4f46]"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          {block.text}
        </p>
      )

    case "image":
      return (
        <figure className="my-8">
          <img
            src={block.src}
            alt={block.alt}
            className="w-full rounded-sm object-cover"
            style={{ maxHeight: "440px", objectPosition: "center" }}
          />
          {block.caption && (
            <figcaption
              className="mt-2 text-center text-[11px] italic text-[#aaa]"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              {block.caption}
            </figcaption>
          )}
        </figure>
      )

    case "quote":
      return (
        <blockquote className="my-8 border-l-4 border-[#9e8060] pl-6">
          <p
            className="text-[17px] font-light italic leading-relaxed text-[#2c1f14]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            "{block.text}"
          </p>
          {block.author && (
            <cite
              className="mt-2 block not-italic text-[11px] font-bold uppercase tracking-[2px] text-[#9e8060]"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              — {block.author}
            </cite>
          )}
        </blockquote>
      )

    case "list":
      return block.style === "bullet" ? (
        <ul className="mb-5 space-y-2 pl-1">
          {block.items.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-[14px] leading-relaxed text-[#5a4f46]"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              <span className="mt-[7px] h-[5px] w-[5px] shrink-0 rounded-full bg-[#9e8060]" />
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <ol className="mb-5 space-y-2 pl-1">
          {block.items.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-[14px] leading-relaxed text-[#5a4f46]"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              <span className="mt-[2px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#9e8060] text-[10px] font-bold text-white">
                {i + 1}
              </span>
              {item}
            </li>
          ))}
        </ol>
      )

    case "tip":
      return (
        <div className="my-6 flex gap-3 border-l-4 border-[#9e8060] bg-[#f6f3ed] p-5">
          <svg
            className="mt-[2px] shrink-0"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9e8060"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-[13px] leading-relaxed text-[#5a4f46]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            <strong className="text-[#9e8060]">Pro Tip: </strong>
            {block.text}
          </p>
        </div>
      )

    case "divider":
      return (
        <div className="my-10 flex items-center gap-3">
          <span className="h-px flex-1 bg-[#ede8e0]" />
          <svg width="20" height="12" viewBox="0 0 32 18" fill="none">
            <path
              d="M1 9 C1 3,8 1,13 6 C14.5 7.5,15 8,16 8 C17 8,17.5 7.5,19 6
                 C24 1,31 3,31 9 C28 8,24 9,22 11 C20 13,18 13,16 11
                 C14 13,12 13,10 11 C8 9,4 8,1 9Z"
              fill="#c8a97a"
            />
          </svg>
          <span className="h-px flex-1 bg-[#ede8e0]" />
        </div>
      )

    default:
      return null
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARE BUTTONS
// ─────────────────────────────────────────────────────────────────────────────
function ShareButtons({ title }: { title: string }) {
  const url = typeof window !== "undefined" ? window.location.href : ""
  const [copied, setCopied] = useState(false)

  const copyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-[#ede8e0] pt-8">
      <span
        className="text-[11px] font-bold uppercase tracking-[2px] text-[#7a6e62]"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        Share:
      </span>

      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-[#1877f2] px-4 py-2 text-[11px] font-bold uppercase tracking-[1.5px] text-white hover:bg-[#1260cc]"
        style={{ fontFamily: "'Montserrat', sans-serif", transition: "background .2s" }}
      >
        Facebook
      </a>

      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-[#1da1f2] px-4 py-2 text-[11px] font-bold uppercase tracking-[1.5px] text-white hover:bg-[#1a8cd8]"
        style={{ fontFamily: "'Montserrat', sans-serif", transition: "background .2s" }}
      >
        Twitter
      </a>

      <button
        onClick={copyLink}
        className="border border-[#9e8060] px-4 py-2 text-[11px] font-bold uppercase tracking-[1.5px] text-[#9e8060] hover:bg-[#9e8060] hover:text-white"
        style={{ fontFamily: "'Montserrat', sans-serif", transition: "all .2s" }}
      >
        {copied ? "Copied!" : "Copy Link"}
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// TAGS ROW
// ─────────────────────────────────────────────────────────────────────────────
function TagsRow({ tags }: { tags: BlogTag[] }) {
  return (
    <div className="mt-8 flex flex-wrap items-center gap-2">
      <span
        className="text-[11px] font-bold uppercase tracking-[2px] text-[#7a6e62]"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        Tags:
      </span>

      {tags.map((tag) => (
        <Link
          key={tag.id}
          href={`/blog?tag=${encodeURIComponent(tag.slug)}`}
          className="border border-[#d6cec4] px-3 py-[5px] text-[11px] text-[#4a3f35] hover:border-[#9e8060] hover:text-[#9e8060]"
          style={{ fontFamily: "'Montserrat', sans-serif", transition: "all .2s" }}
        >
          {tag.name}
        </Link>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export default function BlogDetailContent({ post }: { post: BlogPostDetail }) {
  const dateText =
    post.publishedAt
      ? new Date(post.publishedAt).toLocaleDateString("vi-VN", {
          year: "numeric",
          month: "long",
          day: "2-digit",
        })
      : ""

  return (
    <article>
      <Breadcrumb category={post.category} title={post.title} />

      <span
        className="mb-5 inline-block bg-[#9e8060] px-3 py-[5px] text-[10px] font-bold uppercase tracking-[2px] text-white"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        {post.category.name}
      </span>

      <h1
        className="mb-6 text-[28px] font-light leading-[1.2] text-[#1e1510] md:text-[38px]"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {post.title}
      </h1>

      <AuthorCard author={post.author} date={dateText} readTime={post.readTime} />

      <div className="mb-8 w-full overflow-hidden" style={{ aspectRatio: "16/7" }}>
        <img
          src={post.coverImage}
          alt={post.title}
          className="h-full w-full object-cover object-center"
        />
      </div>

      <p
        className="mb-8 border-l-4 border-[#9e8060] pl-5 text-[15px] font-light italic leading-relaxed text-[#4a3f35]"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {post.excerpt}
      </p>

      <div>
        {post.content.map((block, i) => (
          <ContentBlock key={i} block={block} />
        ))}
      </div>

      {post.tags && post.tags.length > 0 && <TagsRow tags={post.tags} />}

      <ShareButtons title={post.title} />
    </article>
  )
}