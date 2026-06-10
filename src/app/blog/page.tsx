// app/blog/page.tsx

import BannerSection from "../../sections/shared/Banner"
import BlogPage from "../../sections/blog/BlogPage"
import { apiFetch } from "../../lib/api"

export const dynamic = "force-dynamic"
export const revalidate = 0

interface BlogListItem {
  id: number
  slug: string
  category: string
  title: string
  excerpt: string
  image: string
}

interface BlogApiResponse {
  posts: BlogListItem[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
  }
}

interface SidebarMetadataResponse {
  categories: { id: number; name: string; slug: string }[]
  tags: { id: number; name: string; slug: string }[]
  recentPosts: { id: number; slug: string; title: string; image: string }[]
}

type SearchParams = Promise<{
  page?: string
  category?: string
  tag?: string
  search?: string
}>

export default async function BlogListPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const resolvedSearchParams = await searchParams

  const page = resolvedSearchParams.page ?? "1"
  const category = resolvedSearchParams.category ?? ""
  const tag = resolvedSearchParams.tag ?? ""
  const search = resolvedSearchParams.search ?? ""

  const queryParams = new URLSearchParams()
  queryParams.set("page", page)
  if (category) queryParams.set("category", category)
  if (tag) queryParams.set("tag", tag)
  if (search) queryParams.set("search", search)

  let blogData: BlogApiResponse = {
    posts: [],
    pagination: { currentPage: 1, totalPages: 1, totalItems: 0 },
  }

  let sidebarMetadata: SidebarMetadataResponse = {
    categories: [],
    tags: [],
    recentPosts: [],
  }

  try {
    const [fetchedBlogs, fetchedMetadata] = await Promise.all([
      apiFetch<BlogApiResponse>(`/blogs/view-list?${queryParams.toString()}`, {
        cache: "no-store",
      }),
      apiFetch<SidebarMetadataResponse>("/blogs/sidebar-metadata", {
        cache: "no-store",
      }),
    ])

    blogData = fetchedBlogs
    sidebarMetadata = fetchedMetadata
  } catch (error) {
    console.error("[BlogListPage] fetch thất bại:", error)
  }

  return (
    <>
      <BannerSection
        slides={[
          {
            image:
              "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1400&q=85",
            eyebrow: "Trendy Salon & Spa",
            title: "Tin Tức",
          },
        ]}
        height="700px"
      />

      <BlogPage
        posts={blogData.posts ?? []}
        currentPage={blogData.pagination?.currentPage ?? 1}
        totalPages={blogData.pagination?.totalPages ?? 1}
        sidebar={{
          searchQuery: search || undefined,
          categories: sidebarMetadata.categories ?? [],
          activeCategory: category || undefined,
          tags: sidebarMetadata.tags ?? [],
          activeTag: tag || undefined,
          recentPosts: sidebarMetadata.recentPosts ?? [],
        }}
      />
    </>
  )
}