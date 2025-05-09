import { notFound } from "next/navigation";
import ProductDetail from "@/app/components/ProductDetail";
import { Metadata } from "next";

type PageProps = {
  params: {
    id: string;
  };
};

async function getProduct(id: string) {
  const res = await fetch(`https://your-api.com/api/product/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function ProductPage({ params }: PageProps) {
  const product = await getProduct(params.id);

  if (!product) return notFound();

  return <ProductDetail product={product} />;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProduct(params.id);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: product.name,
    description: product.description,
  };
}
