import { notFound } from "next/navigation"
import ComboDetailPage from "../../../sections/combo/ComboDetailPage"
import { type ComboDetail } from "../../../types/combo"
import { apiFetch } from "../../../lib/api"   

async function getCombo(slug: string): Promise<ComboDetail | null> {
  try {
    const data = await apiFetch<ComboDetail>(`/combos/detail/${slug}`)
    return data
  } catch {
    return null
  }
}

export default async function ComboDetailRoute({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const combo = await getCombo(slug)

  if (!combo) notFound()

  return <ComboDetailPage combo={combo} />
}