import { client } from '@/sanity/lib/client';
import ProductDetail from '@/app/components/ProductDetail'; // ✅ Import the correct component

interface Props {
  params: { id: string };
};


const UnstitchProductDetailPage = async ({ params }: Props) => {
  // Await the params to access its properties
  const { id } = await params;

  const query = `*[_type == "unstitch" && _id == $id][0]{
    _id,
    title,
    price,
    discountedPrice,
    fabric,
    description,
    sizeOptions,
    piecesIncluded,
    color,
    "imageUrl": image.asset->url,
    gallery[]{asset->{url}},
    sizeChart{asset->{url}}
  }`;

  const product = await client.fetch(query, { id });

  if (!product) {
    return (
      <div className="text-center py-10 text-red-600">
        Product not found
      </div>
    );
  }

  return <ProductDetail product={product} />;
};

export default UnstitchProductDetailPage;
