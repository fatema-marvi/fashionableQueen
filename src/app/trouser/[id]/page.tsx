import { client } from '@/sanity/lib/client';
import ProductDetail from '@/app/components/ProductDetail'; // ✅ Import the correct component

interface Props {
  params: {
    id: string;
  };
}

const TrouserProductDetailPage = async ({ params }: Props) => {
  const query = `*[_type == "trouser" && _id == $id][0]{
    _id,
    title,
    price,
    discountedPrice,
    fabric,
    description,
    sizeOptions,
    color,
    "imageUrl": image.asset->url,
    gallery[]{asset->{url}},
    sizeChart{asset->{url}}
  }`;

  const product = await client.fetch(query, { id: params.id });

  if (!product) {
    return (
      <div className="text-center py-10 text-red-600">
        Product not found
      </div>
    );
  }

  return <ProductDetail product={product} />;
};

export default TrouserProductDetailPage;
