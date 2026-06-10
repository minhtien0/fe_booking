"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { apiFetch } from "../../lib/api"

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
export interface BlogPost {
  id: string | number
  slug: string
  category: string
  title: string
  excerpt: string
  image: string
  readMoreHref?: string
}

export interface BlogSectionProps {
  eyebrow?: string
  title?: string
}

interface BlogSectionApiResponse {
  posts?: BlogPost[]
  data?: BlogPost[]
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOK — IntersectionObserver, trigger once
// ─────────────────────────────────────────────────────────────────────────────
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true)
          obs.disconnect()
        }
      },
      { threshold }
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  return { ref, inView }
}

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON
// ─────────────────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="flex flex-col animate-pulse">
      <div className="w-full rounded-sm bg-[#e8e0d5]" style={{ aspectRatio: "4/3" }} />
      <div className="pb-8 pt-7">
        <div className="mb-2 h-4 w-4/5 rounded bg-[#e8e0d5]" />
        <div className="mb-5 h-4 w-3/5 rounded bg-[#e8e0d5]" />
        <div className="mb-1 h-3 w-full rounded bg-[#ede8e0]" />
        <div className="mb-7 h-3 w-4/5 rounded bg-[#ede8e0]" />
        <div className="flex items-center gap-3">
          <div className="h-[1.5px] w-7 bg-[#e0d8cc]" />
          <div className="h-3 w-20 rounded bg-[#e8e0d5]" />
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// BLOG CARD
// ─────────────────────────────────────────────────────────────────────────────
function BlogCard({
  post,
  inView,
  delay,
}: {
  post: BlogPost
  inView: boolean
  delay: string
}) {
  const [hovered, setHovered] = useState(false)
  const href = post.readMoreHref ?? `/blog/${post.slug}`

  return (
    <article
      className="flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(44px)",
        transition: `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${delay},
                     transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}`,
      }}
    >
      <Link href={href} className="relative block overflow-hidden" style={{ aspectRatio: "4/3" }}>
        <img
          src={post.image}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover object-center"
          loading="lazy"
          style={{
            transform: hovered ? "scale(1.07)" : "scale(1)",
            filter: hovered ? "brightness(0.78)" : "brightness(1)",
            transition: "transform 0.65s cubic-bezier(0.16,1,0.3,1), filter 0.5s ease",
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.52) 0%, transparent 55%)",
            opacity: hovered ? 1 : 0.55,
            transition: "opacity 0.45s ease",
          }}
        />

        <span
          className="absolute bottom-0 left-0 px-4 py-[7px] text-[10px] font-bold uppercase tracking-[2px] text-white"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            background: hovered ? "#7a6248" : "#9e8060",
            transition: "background 0.3s ease",
          }}
        >
          {post.category}
        </span>
      </Link>

      <div
        className="flex flex-1 flex-col border-b-2 pb-8 pt-7"
        style={{
          borderColor: hovered ? "#9e8060" : "transparent",
          transition: "border-color 0.4s cubic-bezier(0.76,0,0.24,1)",
        }}
      >
        <Link href={href} className="mb-4 block">
          <h3
            className="text-[20px] font-light leading-[1.35]"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: hovered ? "#9e8060" : "#1e1510",
              transition: "color 0.28s ease",
            }}
          >
            {post.title}
          </h3>
        </Link>

        <p
          className="mb-7 flex-1 text-[13px] leading-relaxed text-[#7a6e62]"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          {post.excerpt}
        </p>

        <Link href={href} className="inline-flex items-center gap-3">
          <span
            className="block h-[1.5px] bg-[#9e8060]"
            style={{
              width: hovered ? "40px" : "28px",
              transition: "width 0.38s cubic-bezier(0.16,1,0.3,1)",
            }}
          />
          <span
            className="text-[11px] font-bold uppercase tracking-[2px]"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              color: hovered ? "#9e8060" : "#4a3f35",
              transition: "color 0.25s ease",
            }}
          >
            Read More
          </span>
        </Link>
      </div>
    </article>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CACHE ENGINE FOR BLOG POSTS
// ─────────────────────────────────────────────────────────────────────────────
let _cachedPosts: BlogPost[] | null = null
let _fetchingPostsPromise: Promise<void> | null = null

async function fetchPostsData() {
  if (_cachedPosts) return
  if (_fetchingPostsPromise) return _fetchingPostsPromise

  _fetchingPostsPromise = apiFetch<BlogSectionApiResponse>("/blogs/list-blog-section", {
    cache: "no-store",
  })
    .then((res) => {
      _cachedPosts = res.posts ?? res.data ?? []
    })
    .finally(() => {
      _fetchingPostsPromise = null
    })

  return _fetchingPostsPromise
}

export default function BlogSection({
  eyebrow = "From Blog",
  title = "Diễn Đàn Tin Tức\nCập Nhật Voucher",
}: BlogSectionProps) {
  const { ref, inView } = useInView(0.1)

  const [posts, setPosts] = useState<BlogPost[]>(_cachedPosts ?? [])
  const [isLoading, setIsLoading] = useState(!_cachedPosts)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    if (_cachedPosts) {
      setPosts(_cachedPosts)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setIsError(false)

    fetchPostsData()
      .then(() => {
        setPosts(_cachedPosts!)
      })
      .catch((error) => {
        console.error("[BlogSection] fetch failed:", error)
        setIsError(true)
        setPosts([])
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const slideUp = (delay: string): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(22px)",
    transition: `opacity 0.7s ease ${delay}, transform 0.7s ease ${delay}`,
  })

  const titleLines = title.split("\n")

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;1,300&family=Montserrat:wght@400;600;700&display=swap');
        @media (prefers-reduced-motion: reduce) {
          .blog-section * { transition-duration: 0.01ms !important; }
        }
      `}</style>

      <section
        ref={ref as React.RefObject<HTMLElement>}
        className="blog-section w-full overflow-hidden bg-white px-4 py-20 md:px-10"
      >
        <div className="mx-auto mb-14 max-w-[680px] text-center">
          <p
            className="mb-3 text-[13px] tracking-[2.5px] text-[#b89a6a]"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontStyle: "italic",
              ...slideUp("0s"),
            }}
          >
            {eyebrow}
          </p>

          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(30px, 5vw, 50px)",
              fontWeight: 400,
              color: "#1e1510",
              lineHeight: 1.25,
              ...slideUp("0.12s"),
            }}
          >
            {titleLines.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h2>
        </div>

        {isError && (
          <div className="mx-auto mb-8 max-w-[1180px] rounded-sm border border-[#ede8e0] bg-[#faf8f5] px-6 py-5 text-center text-[13px] text-[#7a6e62]">
            Không thể tải danh sách bài viết.
          </div>
        )}

        {!isError && (
          <div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {isLoading
              ? [0, 1, 2].map((i) => <SkeletonCard key={i} />)
              : posts.map((post, i) => (
                  <BlogCard
                    key={post.id}
                    post={post}
                    inView={inView}
                    delay={`${0.15 + i * 0.13}s`}
                  />
                ))}
          </div>
        )}

        {!isLoading && !isError && posts.length === 0 && (
          <div className="mx-auto mt-6 max-w-[1180px] rounded-sm border border-dashed border-[#ddd] px-6 py-10 text-center text-[13px] text-[#7a6e62]">
            Chưa có bài viết nào.
          </div>
        )}
      </section>
    </>
  )
}