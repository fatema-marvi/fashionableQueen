// src/app/product/[id]/page.tsx
import { notFound } from "next/navigation"
import ProductDetail from "@/app/components/ProductDetail"

async function getProduct(id: string) {
  const res = await fetch(`https://your-api.com/api/product/${id}`, {
    cache: "no-store",
  })

  if (!res.ok) return null
  return res.json()
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)

  if (!product) return notFound()

  return <ProductDetail product={product} />
}
