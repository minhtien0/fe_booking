"use client"

import { useState } from "react"
import Link from "next/link"

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
export interface BlogPostCard {
  id: string | number
  slug: string
  category: string
  title: string
  excerpt: string
  image: string
}

interface BlogCardProps {
  post: BlogPostCard
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function BlogCard({ post }: BlogCardProps) {
  const [hovered, setHovered] = useState(false)

  const href = `/blog/${post.slug}`

  return (
    <article
      className="group flex flex-col overflow-hidden border border-[#ede8e0] bg-white"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transform: hovered ? "translateY(-8px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 22px 50px rgba(30,21,16,0.12)"
          : "0 4px 14px rgba(30,21,16,0.04)",
        borderColor: hovered ? "#d8c2a8" : "#ede8e0",
        transition:
          "transform 0.45s cubic-bezier(0.16,1,0.3,1), box-shadow 0.45s cubic-bezier(0.16,1,0.3,1), border-color 0.35s ease",
      }}
    >
      {/* Image */}
      <Link
        href={href}
        className="relative block overflow-hidden"
        style={{ aspectRatio: "4/3" }}
      >
        <img
          src={post.image}
          alt={post.title}
          className="h-full w-full object-cover object-center"
          loading="lazy"
          style={{
            transform: hovered ? "scale(1.07)" : "scale(1)",
            filter: hovered ? "brightness(0.82)" : "brightness(1)",
            transition:
              "transform 0.7s cubic-bezier(0.16,1,0.3,1), filter 0.45s ease",
          }}
        />

        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.48) 0%, transparent 58%)",
            opacity: hovered ? 1 : 0.55,
            transition: "opacity 0.45s ease",
          }}
        />

        {/* Category badge */}
        <span
          className="absolute bottom-0 left-0 px-3 py-[5px] text-[9px] font-bold uppercase tracking-[2px] text-white"
          style={{
            fontFamily: "'Montserrat',sans-serif",
            background: hovered ? "#7a6248" : "#9e8060",
            transition: "background 0.3s ease",
          }}
        >
          {post.category}
        </span>
      </Link>

      {/* Body */}
      <div
        className="flex flex-1 flex-col px-5 pb-6 pt-5"
        style={{
          borderTop: hovered
            ? "1px solid rgba(158,128,96,0.12)"
            : "1px solid transparent",
          transition: "border-color 0.35s ease",
        }}
      >
        {/* Title */}
        <Link href={href}>
          <h2
            className="mb-3 text-[16px] font-light leading-snug"
            style={{
              fontFamily: "'Playfair Display',serif",
              color: hovered ? "#9e8060" : "#1e1510",
              transition: "color 0.28s ease",
            }}
          >
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        <p
          className="mb-5 flex-1 text-[12px] leading-relaxed text-[#7a6e62]"
          style={{ fontFamily: "'Montserrat',sans-serif" }}
        >
          {post.excerpt}
        </p>

        {/* Read More */}
        <Link href={href} className="inline-flex items-center gap-2">
          <span
            className="block h-[1.5px] bg-[#9e8060]"
            style={{
              width: hovered ? "38px" : "24px",
              transition: "width 0.38s cubic-bezier(0.16,1,0.3,1)",
            }}
          />

          <span
            className="text-[10px] font-bold uppercase tracking-[2px]"
            style={{
              fontFamily: "'Montserrat',sans-serif",
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