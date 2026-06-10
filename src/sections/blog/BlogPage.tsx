import BlogGrid from "../../components/blog/BlogGrid"
import BlogSidebar, { type BlogSidebarProps } from "../../components/blog/BlogSidebar"
import Pagination from "../../components/blog/Pagination"
import { type BlogPostCard } from "../../components/blog/BlogCard"

export interface BlogPageProps {
  posts: BlogPostCard[]
  currentPage: number
  totalPages: number
  isLoading?: boolean
  sidebar: BlogSidebarProps
}

export default function BlogPage({
  posts,
  currentPage,
  totalPages,
  isLoading,
  sidebar,
}: BlogPageProps) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400&family=Montserrat:wght@400;600;700&display=swap');
      `}</style>

      <section className="w-full bg-white py-12 px-4 md:px-10">
        <div className="max-w-[1100px] mx-auto">
          {/* 
            Layout:
            - Desktop  : Blog grid + sidebar
            - Mobile   : Stack layout
          */}
          <div className="flex flex-col lg:flex-row gap-10">

            {/* ── Main Content ───────────────────────────────────────────── */}
            <div className="flex-1 min-w-0">

              {/* ── Empty State ───────────────────────────────────────── */}
              {!isLoading && posts.length === 0 ? (
                <div className="w-full border border-[#ede8e0] bg-[#faf8f5] py-20 px-6 text-center">
                  <h2
                    className="text-[30px] text-[#1e1510] mb-4"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Không tìm thấy Blog
                  </h2>

                  <p
                    className="text-[13px] text-[#7a6e62] leading-relaxed"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    Không tìm thấy tin tức theo nội dung bạn tìm kiếm.
                  </p>
                </div>
              ) : (
                <>
                  {/* ── Blog Grid ───────────────────────────────────── */}
                  <BlogGrid posts={posts} isLoading={isLoading} />

                  {/* ── Pagination ─────────────────────────────────── */}
                  {totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                    />
                  )}
                </>
              )}
            </div>

            {/* ── Sidebar ───────────────────────────────────────────── */}
            <div className="w-full lg:w-[280px] shrink-0">
              <BlogSidebar {...sidebar} />
            </div>

          </div>
        </div>
      </section>
    </>
  )
}