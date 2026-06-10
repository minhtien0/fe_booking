"use client"
import Link from "next/link"
import { type BlogPostCard } from "./BlogCard"

interface BlogDetailRelatedProps {
  posts: BlogPostCard[]
}

export default function BlogDetailRelated({ posts }: BlogDetailRelatedProps) {
  if (!posts.length) return null

  return (
    <div className="mt-16 pt-12 border-t border-[#ede8e0]">
      {/* Heading */}
      <div className="text-center mb-10">
        <p className="text-[#b89a6a] text-[11px] tracking-[3px] italic mb-2"
          style={{ fontFamily: "'Montserrat', sans-serif" }}>
          Continue Reading
        </p>
        <h3 className="text-[26px] font-light text-[#1e1510]"
          style={{ fontFamily: "'Playfair Display', serif" }}>
          Related Articles
        </h3>
        {/* Mustache divider */}
        <div className="flex items-center justify-center gap-3 mt-3">
          {[0,1,2].map(i => (
            <span key={i} className="block w-4 h-[1.5px] bg-[#c8a97a] rounded-full" />
          ))}
          <svg width="24" height="14" viewBox="0 0 32 18" fill="none">
            <path d="M1 9 C1 3,8 1,13 6 C14.5 7.5,15 8,16 8 C17 8,17.5 7.5,19 6 C24 1,31 3,31 9 C28 8,24 9,22 11 C20 13,18 13,16 11 C14 13,12 13,10 11 C8 9,4 8,1 9Z" fill="#b89a6a" />
          </svg>
          {[0,1,2].map(i => (
            <span key={i} className="block w-4 h-[1.5px] bg-[#c8a97a] rounded-full" />
          ))}
        </div>
      </div>

      {/* Grid: max 3 related posts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.slice(0, 3).map(post => (
          <RelatedCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}

function RelatedCard({ post }: { post: BlogPostCard }) {
  const [hovered, setHovered] = (
    // eslint-disable-next-line react-hooks/rules-of-hooks
    require("react") as typeof import("react")
  ).useState(false)

  return (
    <article className="flex flex-col border border-[#ede8e0]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      <Link href={`/blog/${post.slug}`}
        className="block relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
        <img src={post.image} alt={post.title}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            transform: hovered ? "scale(1.06)" : "scale(1)",
            filter: hovered ? "brightness(0.85)" : "brightness(1)",
            transition: "transform .55s cubic-bezier(0.16,1,0.3,1), filter .4s ease",
          }}
          loading="lazy" />
        <span className="absolute bottom-0 left-0 px-3 py-[5px] text-[9px] font-bold tracking-[2px] uppercase text-white bg-[#9e8060]"
          style={{ fontFamily: "'Montserrat', sans-serif" }}>
          {post.category}
        </span>
      </Link>

      <div className="px-4 pt-5 pb-5 flex flex-col flex-1">
        <Link href={`/blog/${post.slug}`}>
          <h4 className="text-[15px] font-light leading-snug text-[#1e1510] mb-3 hover:text-[#9e8060]"
            style={{ fontFamily: "'Playfair Display', serif", transition: "color .2s" }}>
            {post.title}
          </h4>
        </Link>
        <p className="text-[#7a6e62] text-[12px] leading-relaxed mb-4 flex-1"
          style={{ fontFamily: "'Montserrat', sans-serif" }}>
          {post.excerpt}
        </p>
        <Link href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-2">
          <span className="block h-[1.5px] w-6 bg-[#9e8060]"
            style={{ width: hovered ? "40px" : "24px", transition: "width .3s ease" }} />
          <span className="text-[10px] font-bold tracking-[2px] uppercase text-[#4a3f35]"
            style={{ fontFamily: "'Montserrat', sans-serif",
              color: hovered ? "#9e8060" : "#4a3f35", transition: "color .2s" }}>
            Read More
          </span>
        </Link>
      </div>
    </article>
  )
}