import Link from "next/link"
import Image from "next/image"

interface CategoryCardProps {
  title: string
  description: string
  imageUrl: string
  href: string
}

export default function CategoryCard({ title, description, imageUrl, href }: CategoryCardProps) {
  return (
    <Link href={href} className="group">
      <div className="relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
        {/* Category Image */}
        <div className="relative h-80 w-full">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        </div>

        {/* Category Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
          <p className="text-sm text-gray-200 mb-4">{description}</p>
          <span className="inline-block bg-white text-black px-4 py-2 rounded-md font-medium text-sm transition-colors group-hover:bg-blue-600 group-hover:text-white">
            Shop Now
          </span>
        </div>
      </div>
    </Link>
  )
}
