import SearchBox from "./SearchBox"
import CategoryList, { type Category } from "./CategoryList"
import RecentPosts, { type RecentPost } from "./RecentPosts"
import TagCloud, { type Tag } from "./TagCloud"

export interface BlogSidebarProps {
  searchQuery?: string
  categories: Category[]
  activeCategory?: string
  recentPosts: RecentPost[]
  tags: Tag[]
  activeTag?: string
}

export default function BlogSidebar({
  searchQuery,
  categories,
  activeCategory,
  recentPosts,
  tags,
  activeTag,
}: BlogSidebarProps) {
  return (
    <aside className="w-full">
      <SearchBox defaultValue={searchQuery} />
      <CategoryList categories={categories} activeSlug={activeCategory} />
      <RecentPosts posts={recentPosts} />
      <TagCloud tags={tags} activeSlug={activeTag} />
    </aside>
  )
}