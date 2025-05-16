import CategoryCard from "@/app/components/category-card"
import { client } from "@/sanity/lib/client"
import Image from "next/image"

// Function to get a featured product image for each category
async function getCategoryImages() {
  const query = `{
    "stitch": *[_type == "product" && category == "stitch" && defined(imageUrl)][0].imageUrl,
    "unstitch": *[_type == "product" && category == "unstitch" && defined(imageUrl)][0].imageUrl,
    "trouser": *[_type == "product" && category == "trouser" && defined(imageUrl)][0].imageUrl
  }`

  return client.fetch(query)
}

export default async function Home() {
  // Get a featured image for each category
  const categoryImages = await getCategoryImages()

  // Define our main categories
  const categories = [
    {
      title: "Stitch",
      description: "Explore our collection of ready-to-wear stitched outfits",
      imageUrl: "/stitchcard.jpeg",
      href: "/stitch",
    },
    {
      title: "Unstitch",
      description: "Discover premium unstitched fabric for your custom designs",
      imageUrl: "/unstitch.jpg",
      href: "/unstitch",
    },
    {
      title: "Trouser",
      description: "Find the perfect trousers to complete your outfit",
      imageUrl: "/trouser.jpg",
      href: "/trouser",
    },
  ]

  return (
    <main>
      {/* Hero Section with Image */}
      <section className="relative">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <Image src="/hero.jpeg" alt="Fashionable Queen Hero" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-black/40"></div> {/* Dark overlay for better text visibility */}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 py-32 container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Fashionable Queen</h1>
          <p className="text-lg text-gray-100 mb-8 max-w-2xl mx-auto">
            Discover our exclusive collection of premium fashion for every occasion
          </p>
          <button className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-md font-medium transition-colors">
            Shop Now
          </button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <CategoryCard
              key={category.title}
              title={category.title}
              description={category.description}
              imageUrl={category.imageUrl}
              href={category.href}
            />
          ))}
        </div>
      </section>

      {/* Additional homepage sections can go here */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Premium Quality</h3>
              <p className="text-gray-600">We use only the finest fabrics and materials for our products</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Fast Delivery</h3>
              <p className="text-gray-600">Quick and reliable shipping to your doorstep</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Customer Satisfaction</h3>
              <p className="text-gray-600">Your satisfaction is our top priority</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
