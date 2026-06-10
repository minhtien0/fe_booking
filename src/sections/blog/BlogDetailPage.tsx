import BlogDetailContent from "../../components/blog/BlogDetailContent"
import BlogSidebar, { type BlogSidebarProps } from "../../components/blog/BlogSidebar"
import BlogDetailRelated from "../../components/blog/BlogDetailRelated"
import { type BlogPostDetail } from "../../components/blog/BlogDetailContent"

export interface BlogDetailPageProps {
  post: BlogPostDetail
  sidebar: BlogSidebarProps
  relatedPosts?: import("../../components/blog/BlogCard").BlogPostCard[]
}

export default function BlogDetailPage({
  post,
  sidebar,
  relatedPosts = [],
}: BlogDetailPageProps) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Montserrat:wght@400;500;600;700&display=swap');
      `}</style>

      <section className="w-full bg-white py-14 px-4 md:px-10">
        <div className="max-w-[1100px] mx-auto">

          {/* Main layout: content + sidebar */}
          <div className="flex flex-col lg:flex-row gap-12">

            {/* ── LEFT: Article content ── */}
            <div className="flex-1 min-w-0">
              <BlogDetailContent post={post} />
            </div>

            {/* ── RIGHT: Sidebar ── */}
            <div className="w-full lg:w-[280px] shrink-0">
              <BlogSidebar {...sidebar} />
            </div>

          </div>

          {/* Related posts */}
          {relatedPosts.length > 0 && (
            <BlogDetailRelated posts={relatedPosts} />
          )}

        </div>
      </section>
    </>
  )
}