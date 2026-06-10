"use client"

import { useState, useMemo, useCallback } from "react"

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
type BlogStatus = "published" | "draft"

type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "tip";       text: string }
  | { type: "heading";   text: string; level: number }
  | { type: "image";     src: string; alt: string; caption?: string }
  | { type: "list";      items: string[]; style: "bullet" | "ordered" }
  | { type: "quote";     text: string; author?: string }
  | { type: "divider" }

interface BlogCategory { id: number; name: string; slug: string }
interface BlogAuthor   { id: number; name: string; role: string; avatar?: string }
interface BlogTag      { id: number; name: string; slug: string }

interface Blog {
  id:          number
  slug:        string
  title:       string
  excerpt:     string
  coverImage:  string
  readTime:    string
  status:      BlogStatus
  publishedAt: string
  content:     ContentBlock[]
  createdAt:   string
  updatedAt:   string
  category:    BlogCategory
  author:      BlogAuthor
  tags:        BlogTag[]
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_BLOGS: Blog[] = [
  {
    id:1, slug:"how-to-choose-the-right-haircut-by-face-shape",
    title:"How to Choose the Right Haircut by Face Shape",
    excerpt:"Understand which haircuts flatter different face shapes so you can choose a style with confidence.",
    coverImage:"https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=1200&q=85",
    readTime:"8 min read", status:"published", publishedAt:"2026-05-15T00:00:00.000Z",
    createdAt:"2026-05-20T03:29:40.623Z", updatedAt:"2026-05-20T03:29:40.623Z",
    category:{ id:4, name:"Haircut Guide", slug:"haircut-guide" },
    author:{ id:2, name:"Văn Huy", role:"Middle Barber", avatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" },
    tags:[{ id:1, name:"Face Shape", slug:"face-shape" },{ id:2, name:"Haircut Tips", slug:"haircut-tips" }],
    content:[
      { type:"paragraph", text:"The right haircut should balance your features, not fight them. Face shape is one of the simplest ways to narrow down your options." },
      { type:"tip",        text:"Bring two haircut ideas to your barber so you can compare options together." },
      { type:"heading",    text:"1. Oval Face Shape", level:2 },
      { type:"paragraph",  text:"Men with oval faces can usually wear a wide variety of styles, from crops to longer textured cuts." },
      { type:"image",      src:"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&q=85", alt:"Haircut by face shape", caption:"Matching your haircut to your face shape creates a more balanced look." },
      { type:"list",       items:["Oval: most styles work well","Round: add height on top","Square: choose clean, structured lines"], style:"bullet" },
      { type:"quote",      text:"The best haircut is the one that makes your features look intentional.", author:"Marcus Flynn, Senior Stylist" },
      { type:"divider" },
      { type:"list",       items:["Identify your face shape in natural light","Pick styles that balance proportions","Ask your barber for a customized recommendation"], style:"ordered" },
    ],
  },
  {
    id:2, slug:"beard-grooming-101-the-complete-guide",
    title:"Beard Grooming 101: The Complete Guide",
    excerpt:"From trimming technique to the best oils — everything you need to keep your beard looking sharp.",
    coverImage:"https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=1200&q=85",
    readTime:"6 min read", status:"published", publishedAt:"2026-05-10T00:00:00.000Z",
    createdAt:"2026-05-11T08:00:00.000Z", updatedAt:"2026-05-11T08:00:00.000Z",
    category:{ id:2, name:"Beard Care", slug:"beard-care" },
    author:{ id:1, name:"Michel Brown", role:"Senior Barber", avatar:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80" },
    tags:[{ id:3, name:"Beard", slug:"beard" },{ id:4, name:"Grooming", slug:"grooming" }],
    content:[
      { type:"paragraph", text:"A well-groomed beard is a statement. Whether you prefer stubble or a full beard, the fundamentals are the same." },
      { type:"heading",    text:"Daily Maintenance", level:2 },
      { type:"list",       items:["Wash 2-3 times per week","Apply beard oil daily","Comb or brush to train growth direction"], style:"bullet" },
      { type:"tip",        text:"A boar-bristle beard brush distributes natural oils evenly and reduces frizz." },
      { type:"quote",      text:"Your beard says a lot about you before you say a word.", author:"Jack Tosan, Head Barber" },
    ],
  },
  {
    id:3, slug:"top-5-classic-mens-hairstyles-that-never-go-out-of-style",
    title:"Top 5 Classic Men's Hairstyles That Never Go Out of Style",
    excerpt:"These timeless cuts have survived decades of trends — here's why they still look great today.",
    coverImage:"https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1200&q=85",
    readTime:"5 min read", status:"published", publishedAt:"2026-05-01T00:00:00.000Z",
    createdAt:"2026-05-02T09:00:00.000Z", updatedAt:"2026-05-02T09:00:00.000Z",
    category:{ id:1, name:"Style Guide", slug:"style-guide" },
    author:{ id:3, name:"Adam Castellon", role:"Senior Barber", avatar:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80" },
    tags:[{ id:1, name:"Classic Cuts", slug:"classic-cuts" },{ id:5, name:"Men Style", slug:"men-style" }],
    content:[
      { type:"paragraph", text:"Trends come and go, but certain hairstyles have remained staples of men's grooming for decades." },
      { type:"list",       items:["The Crew Cut","The Pompadour","The Side Part","The Slick Back","The Textured Quiff"], style:"ordered" },
      { type:"paragraph",  text:"Each of these cuts adapts well to modern styling products while retaining their classic character." },
    ],
  },
  {
    id:4, slug:"pre-shave-routine-for-sensitive-skin",
    title:"Pre-Shave Routine for Sensitive Skin",
    excerpt:"Prevent razor burn and irritation with these simple prep steps before your next shave.",
    coverImage:"https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=1200&q=85",
    readTime:"4 min read", status:"draft", publishedAt:"",
    createdAt:"2026-05-18T10:00:00.000Z", updatedAt:"2026-05-18T10:00:00.000Z",
    category:{ id:2, name:"Beard Care", slug:"beard-care" },
    author:{ id:2, name:"Văn Huy", role:"Middle Barber", avatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" },
    tags:[{ id:3, name:"Shaving", slug:"shaving" },{ id:6, name:"Skin Care", slug:"skin-care" }],
    content:[
      { type:"paragraph", text:"Sensitive skin requires extra care before the blade ever touches your face." },
      { type:"tip",        text:"Always shave after a warm shower — the steam softens both skin and hair." },
    ],
  },
  {
    id:5, slug:"barber-vs-hair-salon-which-is-right-for-you",
    title:"Barber vs. Hair Salon: Which is Right for You?",
    excerpt:"Understand the key differences so you can make the right choice for your hair type and goals.",
    coverImage:"https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=1200&q=85",
    readTime:"5 min read", status:"draft", publishedAt:"",
    createdAt:"2026-05-19T14:00:00.000Z", updatedAt:"2026-05-19T14:00:00.000Z",
    category:{ id:1, name:"Style Guide", slug:"style-guide" },
    author:{ id:1, name:"Michel Brown", role:"Senior Barber", avatar:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80" },
    tags:[{ id:7, name:"Barber Tips", slug:"barber-tips" }],
    content:[
      { type:"paragraph", text:"The debate between barbershops and salons often comes down to what experience you want." },
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const fmtDate = (iso: string) => {
  if (!iso) return "—"
  const d = new Date(iso)
  return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`
}

const ALL_CATEGORIES = [...new Map(MOCK_BLOGS.map(b => [b.category.slug, b.category])).values()]

// ─────────────────────────────────────────────────────────────────────────────
// STATUS PILL
// ─────────────────────────────────────────────────────────────────────────────
function StatusPill({ status }: { status: BlogStatus }) {
  return (
    <span className="inline-flex items-center gap-[5px] px-[10px] py-[3px] rounded-full text-[11px] font-semibold"
      style={{
        fontFamily: "'Montserrat',sans-serif",
        background: status === "published" ? "rgba(34,197,94,0.1)" : "rgba(156,163,175,0.12)",
        color:      status === "published" ? "#16a34a"              : "#9ca3af",
      }}>
      <span className="w-[5px] h-[5px] rounded-full"
        style={{ background: status === "published" ? "#22c55e" : "#9ca3af" }} />
      {status === "published" ? "Đã xuất bản" : "Bản nháp"}
    </span>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTENT RENDERER
// ─────────────────────────────────────────────────────────────────────────────
function ContentRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "paragraph":
            return (
              <p key={i} className="text-[13px] text-[#4a3f36] leading-[1.85]"
                style={{ fontFamily:"'Montserrat',sans-serif" }}>
                {block.text}
              </p>
            )

          case "heading":
            return (
              <p key={i}
                className={block.level === 2 ? "text-[16px] font-semibold text-[#1e1510] mt-6" : "text-[14px] font-semibold text-[#1e1510] mt-4"}
                style={{ fontFamily:"'Playfair Display',serif" }}>
                {block.text}
              </p>
            )

          case "tip":
            return (
              <div key={i} className="flex gap-3 px-4 py-3 rounded-sm"
                style={{ background:"rgba(184,154,106,0.08)", borderLeft:"3px solid #b89a6a" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b89a6a" strokeWidth="1.8" strokeLinecap="round" className="shrink-0 mt-[1px]">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <p className="text-[12px] text-[#9e8060] leading-relaxed"
                  style={{ fontFamily:"'Montserrat',sans-serif" }}>
                  {block.text}
                </p>
              </div>
            )

          case "quote":
            return (
              <div key={i} className="pl-4 border-l-[3px] border-[#b89a6a] py-1">
                <p className="text-[14px] font-light italic text-[#3a3530] leading-relaxed mb-2"
                  style={{ fontFamily:"'Playfair Display',serif" }}>
                  "{block.text}"
                </p>
                {block.author && (
                  <p className="text-[11px] text-[#b89a6a] font-semibold"
                    style={{ fontFamily:"'Montserrat',sans-serif" }}>
                    — {block.author}
                  </p>
                )}
              </div>
            )

          case "list":
            return (
              <ul key={i} className="space-y-[6px] pl-4">
                {block.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-[13px] text-[#4a3f36] leading-relaxed"
                    style={{ fontFamily:"'Montserrat',sans-serif" }}>
                    {block.style === "ordered"
                      ? <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-[1px]"
                          style={{ background:"rgba(184,154,106,0.12)", color:"#b89a6a" }}>
                          {j+1}
                        </span>
                      : <span className="shrink-0 w-[6px] h-[6px] rounded-full bg-[#b89a6a] mt-[7px]" />
                    }
                    {item}
                  </li>
                ))}
              </ul>
            )

          case "image":
            return (
              <figure key={i} className="rounded-sm overflow-hidden">
                <img src={block.src} alt={block.alt}
                  className="w-full object-cover max-h-[260px]"
                  style={{ display:"block" }}
                  onError={e => { (e.target as HTMLImageElement).style.display = "none" }}
                />
                {block.caption && (
                  <figcaption className="px-3 py-2 text-[11px] text-[#9e8060] italic text-center"
                    style={{ fontFamily:"'Montserrat',sans-serif", background:"#faf8f5" }}>
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            )

          case "divider":
            return (
              <div key={i} className="flex items-center gap-3 py-2">
                <div className="flex-1 h-px bg-[#ede8e0]" />
                <div className="flex gap-1">
                  {[0,1,2].map(k => <span key={k} className="w-[4px] h-[4px] rounded-full bg-[#d6cec4]" />)}
                </div>
                <div className="flex-1 h-px bg-[#ede8e0]" />
              </div>
            )

          default:
            return null
        }
      })}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// BLOG DETAIL PANEL (right)
// ─────────────────────────────────────────────────────────────────────────────
function DetailPanel({ blog, onClose, onToggleStatus, onDelete }: {
  blog: Blog | null
  onClose: () => void
  onToggleStatus: (id: number) => void
  onDelete: (b: Blog) => void
}) {
  const [tab, setTab] = useState<"detail"|"content">("detail")

  // reset tab when blog changes
  useMemo(() => { setTab("detail") }, [blog?.id])

  if (!blog) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-6">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
          style={{ background:"#f8f5f0" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d6cec4" strokeWidth="1.5" strokeLinecap="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
          </svg>
        </div>
        <p className="text-[12px] text-[#bbb]" style={{ fontFamily:"'Montserrat',sans-serif" }}>
          Chọn bài viết để xem chi tiết
        </p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ fontFamily:"'Montserrat',sans-serif" }}>
      {/* Header */}
      <div className="shrink-0 px-5 py-4 border-b border-[#f0ebe3] flex items-center justify-between">
        <p className="text-[10px] font-bold tracking-[1.8px] uppercase text-[#b89a6a]">Chi tiết bài viết</p>
        <button onClick={onClose} className="w-6 h-6 flex items-center justify-center text-[#bbb] hover:text-[#9e8060]"
          style={{ transition:"color 0.15s" }}>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Cover image */}
      {blog.coverImage && (
        <div className="shrink-0 h-[140px] overflow-hidden">
          <img src={blog.coverImage} alt={blog.title}
            className="w-full h-full object-cover"
            onError={e => { (e.target as HTMLImageElement).parentElement!.style.display = "none" }}
          />
        </div>
      )}

      {/* Tabs */}
      <div className="shrink-0 flex border-b border-[#f0ebe3]">
        {[["detail","Thông tin"],["content","Nội dung"]].map(([k,lbl]) => (
          <button key={k} onClick={() => setTab(k as any)}
            className="flex-1 py-[10px] text-[11px] font-semibold relative"
            style={{
              fontFamily: "'Montserrat',sans-serif",
              color: tab === k ? "#b89a6a" : "#9e8060",
              transition: "color 0.15s",
            }}>
            {lbl}
            {tab === k && (
              <span className="absolute bottom-0 left-1/4 right-1/4 h-[2px]" style={{ background:"#b89a6a" }} />
            )}
          </button>
        ))}
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {tab === "detail" ? (
          <div>
            {/* Title + status */}
            <div className="px-5 py-4 border-b border-[#f8f5f0]">
              <div className="mb-2"><StatusPill status={blog.status} /></div>
              <p className="text-[14px] font-semibold text-[#1e1510] leading-snug mb-1"
                style={{ fontFamily:"'Playfair Display',serif" }}>
                {blog.title}
              </p>
              <p className="text-[11px] text-[#9e8060] leading-relaxed">{blog.excerpt}</p>
            </div>

            {/* Author */}
            <div className="px-5 py-4 border-b border-[#f8f5f0] flex items-center gap-3">
              {blog.author.avatar
                ? <img src={blog.author.avatar} alt={blog.author.name}
                    className="w-9 h-9 rounded-full object-cover shrink-0"
                    onError={e => { (e.target as HTMLImageElement).style.display="none" }} />
                : <div className="w-9 h-9 rounded-full bg-[#b89a6a] flex items-center justify-center text-white text-[12px] font-bold shrink-0"
                    style={{ fontFamily:"'Playfair Display',serif" }}>
                    {blog.author.name.charAt(0)}
                  </div>
              }
              <div>
                <p className="text-[12px] font-semibold text-[#1e1510]">{blog.author.name}</p>
                <p className="text-[10px] text-[#9e8060]">{blog.author.role}</p>
              </div>
            </div>

            {/* Meta rows */}
            <div className="px-5 py-4 border-b border-[#f8f5f0]">
              {[
                ["ID",           `#${blog.id}`],
                ["Danh mục",     blog.category.name],
                ["Thời gian đọc",blog.readTime],
                ["Xuất bản",     fmtDate(blog.publishedAt)],
                ["Tạo lúc",      fmtDate(blog.createdAt)],
                ["Cập nhật",     fmtDate(blog.updatedAt)],
                ["Số blocks",    `${blog.content.length} blocks`],
              ].map(([label, val]) => (
                <div key={label} className="flex items-start justify-between py-[7px] border-b border-[#f8f5f0] last:border-0">
                  <span className="text-[11px] text-[#9e8060] shrink-0">{label}</span>
                  <span className="text-[11px] font-semibold text-[#1e1510] text-right ml-2">{val}</span>
                </div>
              ))}
            </div>

            {/* Tags */}
            {blog.tags.length > 0 && (
              <div className="px-5 py-4 border-b border-[#f8f5f0]">
                <p className="text-[10px] font-bold tracking-[1.5px] uppercase text-[#bbb] mb-2">Tags</p>
                <div className="flex flex-wrap gap-[6px]">
                  {blog.tags.map(t => (
                    <span key={t.id}
                      className="px-[9px] py-[3px] text-[10px] font-semibold rounded-full"
                      style={{ background:"rgba(184,154,106,0.1)", color:"#b89a6a" }}>
                      #{t.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Slug */}
            <div className="px-5 py-4">
              <p className="text-[10px] font-bold tracking-[1.5px] uppercase text-[#bbb] mb-1">Slug</p>
              <code className="text-[10px] text-[#9e8060] break-all leading-relaxed"
                style={{ fontFamily:"monospace" }}>
                /{blog.slug}
              </code>
            </div>
          </div>
        ) : (
          /* Content preview */
          <div className="px-5 py-5">
            <ContentRenderer blocks={blog.content} />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="shrink-0 px-5 pb-5 pt-3 border-t border-[#f0ebe3] flex flex-col gap-2">
        <button
          onClick={() => onToggleStatus(blog.id)}
          className="w-full py-[9px] text-[12px] font-bold tracking-[1px] uppercase text-white"
          style={{ background:"#b89a6a", fontFamily:"'Montserrat',sans-serif" }}
          onMouseOver={e => (e.currentTarget.style.background = "#a08455")}
          onMouseOut={e  => (e.currentTarget.style.background = "#b89a6a")}>
          {blog.status === "published" ? "Chuyển về nháp" : "Xuất bản ngay"}
        </button>
        <button
          onClick={() => onDelete(blog)}
          className="w-full py-[9px] text-[12px] font-semibold border border-[#ede8e0] text-[#9ca3af] hover:border-red-300 hover:text-red-400"
          style={{ fontFamily:"'Montserrat',sans-serif", transition:"all 0.15s" }}>
          Xoá bài viết
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// DELETE CONFIRM
// ─────────────────────────────────────────────────────────────────────────────
function DeleteConfirm({ title, onConfirm, onClose }: {
  title: string; onConfirm: () => void; onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background:"rgba(0,0,0,0.5)", backdropFilter:"blur(4px)" }}
      onClick={onClose}>
      <div className="w-full max-w-[340px] bg-white p-6"
        style={{ boxShadow:"0 24px 64px rgba(0,0,0,0.18)" }}
        onClick={e => e.stopPropagation()}>
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round">
            <path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"/>
          </svg>
        </div>
        <h3 className="text-center text-[16px] font-light text-[#1e1510] mb-1"
          style={{ fontFamily:"'Playfair Display',serif" }}>Xoá bài viết?</h3>
        <p className="text-center text-[12px] text-[#9e8060] mb-6 px-2 leading-relaxed"
          style={{ fontFamily:"'Montserrat',sans-serif" }}>
          "<strong>{title}</strong>" sẽ bị xoá vĩnh viễn.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-[9px] border border-[#ede8e0] text-[12px] font-semibold text-[#9e8060]"
            style={{ fontFamily:"'Montserrat',sans-serif" }}>Huỷ</button>
          <button onClick={onConfirm}
            className="flex-1 py-[9px] text-[12px] font-bold text-white bg-red-500"
            style={{ fontFamily:"'Montserrat',sans-serif" }}>Xoá</button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, accent = "#b89a6a" }: {
  label: string; value: string | number; icon: React.ReactNode; accent?: string
}) {
  return (
    <div className="bg-white p-5 flex items-center gap-4" style={{ border:"1px solid #f0ebe3" }}>
      <div className="w-11 h-11 flex items-center justify-center rounded-sm shrink-0"
        style={{ background:`${accent}15`, color:accent }}>
        {icon}
      </div>
      <div>
        <p className="text-[22px] font-light text-[#1e1510]"
          style={{ fontFamily:"'Playfair Display',serif" }}>{value}</p>
        <p className="text-[11px] text-[#9e8060]" style={{ fontFamily:"'Montserrat',sans-serif" }}>{label}</p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// BLOG CARD (grid view)
// ─────────────────────────────────────────────────────────────────────────────
function BlogCard({ blog, isActive, onClick }: { blog: Blog; isActive: boolean; onClick: () => void }) {
  return (
    <div onClick={onClick} className="bg-white cursor-pointer group overflow-hidden"
      style={{
        border:     isActive ? "1px solid #b89a6a" : "1px solid #f0ebe3",
        boxShadow:  isActive ? "0 2px 16px rgba(184,154,106,0.15)" : "none",
        transition: "all 0.2s",
      }}>
      {/* Cover */}
      <div className="h-[140px] overflow-hidden bg-[#f0ebe3] relative">
        {blog.coverImage && (
          <img src={blog.coverImage} alt={blog.title}
            className="w-full h-full object-cover"
            style={{ transition:"transform 0.4s ease" }}
            onMouseOver={e => { (e.target as HTMLImageElement).style.transform = "scale(1.04)" }}
            onMouseOut={e  => { (e.target as HTMLImageElement).style.transform = "scale(1)" }}
            onError={e => { (e.target as HTMLImageElement).style.display = "none" }}
          />
        )}
        <div className="absolute top-2 right-2"><StatusPill status={blog.status} /></div>
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Category */}
        <span className="text-[10px] font-bold tracking-[1px] uppercase text-[#b89a6a] mb-2 block"
          style={{ fontFamily:"'Montserrat',sans-serif" }}>
          {blog.category.name}
        </span>

        <p className="text-[13px] font-semibold text-[#1e1510] leading-snug mb-2 line-clamp-2"
          style={{ fontFamily:"'Playfair Display',serif" }}>
          {blog.title}
        </p>

        <p className="text-[11px] text-[#9e8060] leading-relaxed line-clamp-2 mb-3"
          style={{ fontFamily:"'Montserrat',sans-serif" }}>
          {blog.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[#f8f5f0]">
          <div className="flex items-center gap-2">
            {blog.author.avatar
              ? <img src={blog.author.avatar} alt={blog.author.name}
                  className="w-6 h-6 rounded-full object-cover"
                  onError={e => { (e.target as HTMLImageElement).style.display="none" }} />
              : <div className="w-6 h-6 rounded-full bg-[#b89a6a] flex items-center justify-center text-white text-[9px] font-bold"
                  style={{ fontFamily:"'Montserrat',sans-serif" }}>
                  {blog.author.name.charAt(0)}
                </div>
            }
            <span className="text-[10px] text-[#9e8060]" style={{ fontFamily:"'Montserrat',sans-serif" }}>
              {blog.author.name}
            </span>
          </div>
          <span className="text-[10px] text-[#bbb]" style={{ fontFamily:"'Montserrat',sans-serif" }}>
            {blog.readTime}
          </span>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminBlogPage() {
  const [blogs,        setBlogs]        = useState<Blog[]>(MOCK_BLOGS)
  const [search,       setSearch]       = useState("")
  const [filterStatus, setFilterStatus] = useState<"all"|BlogStatus>("all")
  const [filterCat,    setFilterCat]    = useState("all")
  const [viewMode,     setViewMode]     = useState<"table"|"grid">("table")
  const [detail,       setDetail]       = useState<Blog|null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Blog|null>(null)

  // ── Derived ────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = blogs
    if (search)               list = list.filter(b => b.title.toLowerCase().includes(search.toLowerCase()) || b.author.name.toLowerCase().includes(search.toLowerCase()))
    if (filterStatus !== "all") list = list.filter(b => b.status === filterStatus)
    if (filterCat    !== "all") list = list.filter(b => b.category.slug === filterCat)
    return list
  }, [blogs, search, filterStatus, filterCat])

  const published = blogs.filter(b => b.status === "published").length
  const drafts    = blogs.filter(b => b.status === "draft").length

  // ── Handlers ──────────────────────────────────────────────────────
  const handleToggleStatus = useCallback((id: number) => {
    setBlogs(bs => bs.map(b => b.id === id
      ? { ...b, status: b.status === "published" ? "draft" : "published" }
      : b
    ))
    setDetail(d => d?.id === id ? { ...d, status: d.status === "published" ? "draft" : "published" } : d)
  }, [])

  const handleDelete = useCallback(() => {
    if (!deleteTarget) return
    setBlogs(bs => bs.filter(b => b.id !== deleteTarget.id))
    if (detail?.id === deleteTarget.id) setDetail(null)
    setDeleteTarget(null)
  }, [deleteTarget, detail])

  // ─────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;1,300&family=Montserrat:wght@400;500;600;700&display=swap');
        .row-hover:hover { background:#fffaf4 !important; }
        select { appearance:none; -webkit-appearance:none; }
        .scrollbar-thin::-webkit-scrollbar { width:4px; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background:#e5ddd0; border-radius:4px; }
        .line-clamp-2 { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
      `}</style>

      {/* ── Page header ──────────────────────────────────────────────── */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-[11px] tracking-[2.5px] uppercase mb-1"
            style={{ color:"#b89a6a", fontFamily:"'Montserrat',sans-serif" }}>Quản lý</p>
          <h1 className="text-[28px] font-light text-[#1e1510]"
            style={{ fontFamily:"'Playfair Display',serif" }}>Blog</h1>
        </div>
        <button
          className="flex items-center gap-2 h-10 px-5 text-[12px] font-bold tracking-[1px] uppercase text-white"
          style={{ background:"#b89a6a", fontFamily:"'Montserrat',sans-serif" }}
          onMouseOver={e => (e.currentTarget.style.background = "#a08455")}
          onMouseOut={e  => (e.currentTarget.style.background = "#b89a6a")}>
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v12M1 7h12" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          Bài viết mới
        </button>
      </div>

      {/* ── Stat cards ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Tổng bài viết" value={blogs.length} icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
          </svg>
        }/>
        <StatCard label="Đã xuất bản" value={published} accent="#22c55e" icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/>
          </svg>
        }/>
        <StatCard label="Bản nháp" value={drafts} accent="#9ca3af" icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        }/>
        <StatCard label="Danh mục" value={ALL_CATEGORIES.length} accent="#9b7a9b" icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
          </svg>
        }/>
      </div>

      {/* ── 2-col layout ─────────────────────────────────────────────── */}
      <div className="flex gap-5 items-start">
        {/* MAIN */}
        <div className="flex-1 min-w-0 flex flex-col gap-3">

          {/* Toolbar */}
          <div className="bg-white px-4 py-3 flex flex-wrap items-center gap-2"
            style={{ border:"1px solid #f0ebe3" }}>
            {/* Search */}
            <div className="relative flex-1 min-w-[180px]">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.8" strokeLinecap="round"
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input type="text" placeholder="Tìm tiêu đề, tác giả..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-[6px] text-[12px] border border-[#ede8e0] outline-none"
                style={{ fontFamily:"'Montserrat',sans-serif", color:"#1e1510", transition:"border-color 0.15s" }}
                onFocus={e => (e.target.style.borderColor = "#b89a6a")}
                onBlur={e  => (e.target.style.borderColor = "#ede8e0")}
              />
            </div>

            {/* Status */}
            <div className="relative">
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)}
                className="pl-3 pr-8 py-[6px] text-[12px] border border-[#ede8e0] outline-none bg-white cursor-pointer"
                style={{ fontFamily:"'Montserrat',sans-serif", color:"#3a3530", transition:"border-color 0.15s" }}
                onFocus={e => (e.target.style.borderColor = "#b89a6a")}
                onBlur={e  => (e.target.style.borderColor = "#ede8e0")}>
                <option value="all">Tất cả trạng thái</option>
                <option value="published">Đã xuất bản</option>
                <option value="draft">Bản nháp</option>
              </select>
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none"
                className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <path d="M2 4l4 4 4-4" stroke="#bbb" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </div>

            {/* Category */}
            <div className="relative">
              <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
                className="pl-3 pr-8 py-[6px] text-[12px] border border-[#ede8e0] outline-none bg-white cursor-pointer"
                style={{ fontFamily:"'Montserrat',sans-serif", color:"#3a3530", transition:"border-color 0.15s" }}
                onFocus={e => (e.target.style.borderColor = "#b89a6a")}
                onBlur={e  => (e.target.style.borderColor = "#ede8e0")}>
                <option value="all">Tất cả danh mục</option>
                {ALL_CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none"
                className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <path d="M2 4l4 4 4-4" stroke="#bbb" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </div>

            {/* View toggle */}
            <div className="flex border border-[#ede8e0] ml-auto">
              {(["table","grid"] as const).map(v => (
                <button key={v} onClick={() => setViewMode(v)}
                  className="w-8 h-8 flex items-center justify-center transition-all"
                  style={{ background: viewMode === v ? "#b89a6a" : "transparent", color: viewMode === v ? "#fff" : "#9e8060" }}>
                  {v === "table"
                    ? <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M1 4h12M1 8h12M1 12h12M4 1v12"/></svg>
                    : <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><rect x="1" y="1" width="5" height="5" rx="1"/><rect x="8" y="1" width="5" height="5" rx="1"/><rect x="1" y="8" width="5" height="5" rx="1"/><rect x="8" y="8" width="5" height="5" rx="1"/></svg>
                  }
                </button>
              ))}
            </div>
          </div>

          {/* TABLE */}
          {viewMode === "table" && (
            <div className="bg-white" style={{ border:"1px solid #f0ebe3" }}>
              <div className="overflow-x-auto">
                <table className="w-full" style={{ minWidth:640 }}>
                  <thead>
                    <tr style={{ borderBottom:"1px solid #f0ebe3", background:"#faf8f5" }}>
                      {["Bài viết","Danh mục","Tác giả","Ngày","Trạng thái",""].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-[9px] font-bold tracking-[1.5px] uppercase text-[#bbb]"
                          style={{ fontFamily:"'Montserrat',sans-serif" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr><td colSpan={6} className="px-4 py-14 text-center text-[12px] text-[#bbb]"
                        style={{ fontFamily:"'Montserrat',sans-serif" }}>Không có bài viết phù hợp</td></tr>
                    ) : filtered.map((b, idx) => {
                      const isActive = detail?.id === b.id
                      return (
                        <tr key={b.id}
                          className="row-hover cursor-pointer"
                          onClick={() => setDetail(isActive ? null : b)}
                          style={{
                            borderBottom: idx < filtered.length-1 ? "1px solid #f8f5f0" : "none",
                            background:   isActive ? "#fffaf4" : "transparent",
                            transition:   "background 0.15s",
                          }}>
                          {/* Title + thumbnail */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-9 rounded-sm overflow-hidden shrink-0 bg-[#f0ebe3]">
                                {b.coverImage && (
                                  <img src={b.coverImage} alt={b.title}
                                    className="w-full h-full object-cover"
                                    onError={e => { (e.target as HTMLImageElement).style.display="none" }} />
                                )}
                              </div>
                              <div style={{ maxWidth:240 }}>
                                <p className="text-[12px] font-semibold text-[#1e1510] line-clamp-1"
                                  style={{ fontFamily:"'Montserrat',sans-serif" }}>{b.title}</p>
                                <p className="text-[10px] text-[#bbb] line-clamp-1 mt-[1px]"
                                  style={{ fontFamily:"'Montserrat',sans-serif" }}>{b.excerpt}</p>
                              </div>
                            </div>
                          </td>
                          {/* Category */}
                          <td className="px-4 py-3">
                            <span className="text-[11px] font-semibold px-[8px] py-[3px] rounded-full"
                              style={{ background:"rgba(184,154,106,0.1)", color:"#b89a6a", fontFamily:"'Montserrat',sans-serif" }}>
                              {b.category.name}
                            </span>
                          </td>
                          {/* Author */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {b.author.avatar
                                ? <img src={b.author.avatar} alt={b.author.name} className="w-6 h-6 rounded-full object-cover"
                                    onError={e => { (e.target as HTMLImageElement).style.display="none" }} />
                                : <div className="w-6 h-6 rounded-full bg-[#b89a6a] flex items-center justify-center text-white text-[9px] font-bold"
                                    style={{ fontFamily:"'Montserrat',sans-serif" }}>
                                    {b.author.name.charAt(0)}
                                  </div>
                              }
                              <span className="text-[12px] text-[#3a3530]"
                                style={{ fontFamily:"'Montserrat',sans-serif" }}>{b.author.name}</span>
                            </div>
                          </td>
                          {/* Date */}
                          <td className="px-4 py-3">
                            <span className="text-[12px] text-[#9e8060]"
                              style={{ fontFamily:"'Montserrat',sans-serif" }}>
                              {fmtDate(b.publishedAt || b.createdAt)}
                            </span>
                          </td>
                          {/* Status */}
                          <td className="px-4 py-3"><StatusPill status={b.status} /></td>
                          {/* Actions */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1 justify-end" onClick={e => e.stopPropagation()}>
                              <button
                                onClick={() => handleToggleStatus(b.id)}
                                className="w-7 h-7 flex items-center justify-center border border-[#ede8e0] text-[#9e8060] hover:border-[#22c55e] hover:text-[#22c55e]"
                                style={{ transition:"all 0.15s" }}
                                title={b.status === "published" ? "Về nháp" : "Xuất bản"}>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                                  {b.status === "published"
                                    ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                                    : <><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></>
                                  }
                                </svg>
                              </button>
                              <button
                                onClick={() => setDeleteTarget(b)}
                                className="w-7 h-7 flex items-center justify-center border border-[#ede8e0] text-[#9e8060] hover:border-red-300 hover:text-red-400"
                                style={{ transition:"all 0.15s" }} title="Xoá">
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                                  <path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"/>
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-3 border-t border-[#f0ebe3]">
                <span className="text-[11px] text-[#bbb]" style={{ fontFamily:"'Montserrat',sans-serif" }}>
                  {filtered.length} bài viết
                </span>
              </div>
            </div>
          )}

          {/* GRID */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(b => (
                <BlogCard key={b.id} blog={b}
                  isActive={detail?.id === b.id}
                  onClick={() => setDetail(detail?.id === b.id ? null : b)}
                />
              ))}
              {filtered.length === 0 && (
                <div className="col-span-3 py-16 text-center text-[12px] text-[#bbb]"
                  style={{ fontFamily:"'Montserrat',sans-serif" }}>
                  Không có bài viết phù hợp
                </div>
              )}
            </div>
          )}
        </div>

        {/* DETAIL PANEL */}
        <div className="w-[300px] shrink-0 bg-white self-stretch"
          style={{ border:"1px solid #f0ebe3", minHeight:500 }}>
          <DetailPanel
            blog={detail}
            onClose={() => setDetail(null)}
            onToggleStatus={handleToggleStatus}
            onDelete={b => setDeleteTarget(b)}
          />
        </div>
      </div>

      {/* DELETE MODAL */}
      {deleteTarget && (
        <DeleteConfirm
          title={deleteTarget.title}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </>
  )
}