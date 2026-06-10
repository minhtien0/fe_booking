import { notFound } from "next/navigation"
import BannerSection from "../../../sections/shared/Banner"
import BlogDetailPage from "../../../sections/blog/BlogDetailPage"
import { type BlogPostDetail } from "../../../components/blog/BlogDetailContent"
import { apiFetch } from "../../../lib/api"

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface SidebarMetadataResponse {
  categories: {
    id: number
    name: string
    slug: string
  }[]

  tags: {
    id: number
    name: string
    slug: string
  }[]

  recentPosts: {
    id: number
    slug: string
    title: string
    image: string
  }[]
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default async function BlogDetailRoute({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  let post: BlogPostDetail | null = null

  let sidebarMetadata: SidebarMetadataResponse = {
    categories: [],
    tags: [],
    recentPosts: [],
  }

  try {
    // CALL SONG SONG 2 API
    const [fetchedPost, fetchedSidebar] = await Promise.all([
      apiFetch<BlogPostDetail>(`/blogs/detail/${slug}`, {
        cache: "no-store",
      }),

      apiFetch<SidebarMetadataResponse>("/blogs/sidebar-metadata", {
        next: { revalidate: 3600 },
      }),
    ])

    post = fetchedPost
    sidebarMetadata = fetchedSidebar
  } catch (error) {
    console.error("[BlogDetailRoute] fetch failed:", error)
    notFound()
  }

  if (!post) notFound()

  return (
    <>
      <BannerSection
        slides={[
          {
            image: post.coverImage,
            eyebrow: post.category.name,
            title: "Tin Tức",
          },
        ]}
        height="340px"
      />

      <BlogDetailPage
        post={post ?? {}}
        relatedPosts={[]}
        sidebar={{
          categories: sidebarMetadata.categories ?? [],
          activeCategory: post.category.slug,
          tags: sidebarMetadata.tags ?? [],
          recentPosts: sidebarMetadata.recentPosts ?? [],
        }}
      />
    </>
  )
}