import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/sanity/lib/client" // adjust path

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!
const token = process.env.SANITY_API_WRITE_TOKEN!

const uploadClient = createClient({
  projectId,
  dataset,
  apiVersion: "2023-10-01",
  token,
  useCdn: false,
})

async function uploadToSanity(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer())
  const asset = await uploadClient.assets.upload("image", buffer, {
    filename: file.name,
    contentType: file.type,
  })
  return {
    _type: "image",
    asset: {
      _type: "reference",
      _ref: asset._id,
    },
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const price = Number.parseFloat(formData.get("price") as string)
    const discountedPrice = Number.parseFloat(formData.get("discountedPrice") as string)
    const fabric = formData.get("fabric") as string
    const sizeOptions = JSON.parse(formData.get("sizeOptions") as string)
    const category = formData.get("category") as string
    const piecesIncluded = JSON.parse(formData.get("piecesIncluded") as string)

    const imageFile = formData.get("image") as File
    const sizeChartFile = formData.get("sizeChart") as File
    const galleryFiles = formData.getAll("gallery") as File[]

    // Upload images to Sanity
    const image = imageFile ? await uploadToSanity(imageFile) : null
    const sizeChart = sizeChartFile ? await uploadToSanity(sizeChartFile) : null
    const gallery = await Promise.all(galleryFiles.map((file) => uploadToSanity(file)))

    // Create product document
    const doc = {
      _type: category || "product", // Use the category as the document type
      title,
      description,
      price,
      discountedPrice,
      fabric,
      sizeOptions,
      piecesIncluded,
      category,
      image,
      gallery,
      sizeChart,
    }

    const writeClientInstance = createClient({
      projectId,
      dataset,
      apiVersion: "2023-10-01",
      token,
      useCdn: false,
    })
    const result = await writeClientInstance.create(doc)
    return NextResponse.json({ success: true, data: result })
  } catch (err: any) {
    console.error("Upload error:", err)
    return NextResponse.json({ success: false, message: err.message })
  }
}
