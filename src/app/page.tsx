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
      {/* Hero Section with Responsive Height and Full Width Image */}
      <section className="relative">
        {/* Hero Background Image */}
        <div className="relative h-[300px] md:h-[400px] lg:h-[500px] w-full overflow-hidden">
          <Image
            src="/hero.jpeg"
            alt="Fashionable Queen Hero"
            fill
            priority
            className="object-contain md:object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 "></div> {/* Dark overlay for better text visibility */}
        </div>

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col justify-center items-center px-4 text-center">
           </div>
      </section>

      {/* Categories Section */}
      <section className="pt-8 pb-12 md:pt-12 md:pb-16 container mx-auto px-4">
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
