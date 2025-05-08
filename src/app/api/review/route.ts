
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@sanity/client"

// ✅ Use correct config format for App Router (Next.js 13+)
export const dynamic = "force-dynamic" // Optional: avoids caching issues

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  useCdn: false,
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN!,
})

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const productId = searchParams.get("product")

    if (!productId) {
      return NextResponse.json({ error: "Missing product ID" }, { status: 400 })
    }

    // Fetch reviews for the product
    const reviews = await client.fetch(
      `*[_type == "review" && product._ref == $productId]{
        _id,
        rating,
        review,
        author,
        createdAt
      } | order(createdAt desc)`,
      { productId },
    )

    return NextResponse.json({ reviews })
  } catch (error: any) {
    console.error("❌ Error fetching reviews:", error.message || error)
    return NextResponse.json({ error: "Internal server error", detail: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log("Incoming review payload:", body)

    const { product, rating, review, author } = body

    // ✅ Validation
    if (!product || typeof product !== "string") {
      return NextResponse.json({ error: "Missing or invalid product ID" }, { status: 400 })
    }

    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be a number between 1 and 5" }, { status: 400 })
    }

    if (!review || typeof review !== "string" || review.trim().length < 1 || review.trim().length > 500) {
      return NextResponse.json({ error: "Review text must be between 1 and 500 characters" }, { status: 400 })
    }

    if (!author || typeof author !== "string" || author.trim().length < 1) {
      return NextResponse.json({ error: "Author name is required" }, { status: 400 })
    }

    // ✅ Check if product exists
    const productExists = await client.fetch(
      `*[(_type == "stitch" || _type == "unstitch" || _type == "trouser" || _type == "product") && _id == $id][0]`,
      { id: product },
    )

    if (!productExists) {
      return NextResponse.json({ error: "Product not found" }, { status: 400 })
    }

    // ✅ Create review
    const newReview = await client.create({
      _type: "review",
      product: {
        _type: "reference",
        _ref: product,
      },
      rating,
      review,
      author,
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({ message: "Review added", review: newReview }, { status: 201 })
  } catch (error: any) {
    console.error("❌ Error creating review:", error.message || error)
    return NextResponse.json({ error: "Internal server error", detail: error.message }, { status: 500 })
  }
}