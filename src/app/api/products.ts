import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { client } from "@/sanity/lib/client";
import fs from "fs";

// Disable default body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

// Upload file to Sanity
const uploadFileToSanity = async (filePath: string) => {
  const file = fs.createReadStream(filePath);
  const result = await client.assets.upload("image", file);
  return result._id;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
      try {
        const {
          title,
          description,
          price,
          discountedPrice,
          sizeOptions,
          fabric,
          piecesIncluded,
          category,
        } = fields;

        const image = files.image;
        const gallery = Array.isArray(files.gallery) ? files.gallery : [files.gallery];
        const sizeChart = files.sizeChart;

        const imageAssetId = image && image[0] ? await uploadFileToSanity(image[0].filepath) : null;
        const galleryAssetIds = await Promise.all(
          gallery.map((file) => file ? uploadFileToSanity(file.filepath) : null).filter(Boolean)
        );
        const sizeChartAssetId = sizeChart
          ? await uploadFileToSanity(sizeChart[0].filepath)
          : null;

        const product = {
          _type: "product",
          title,
          description,
          price: Number(price),
          discountedPrice: Number(discountedPrice),
          sizeOptions: sizeOptions ? JSON.parse(sizeOptions as unknown as string) : [], // expect ["S","M","L"]
          fabric,
          category,
          piecesIncluded: piecesIncluded ? JSON.parse(piecesIncluded as unknown as string) : [], // expect ["Top","Bottom"]
          image: { _type: "image", asset: { _ref: imageAssetId } },
          gallery: galleryAssetIds.map((id) => ({ _type: "image", asset: { _ref: id } })),
          sizeChart: sizeChartAssetId ? { _type: "image", asset: { _ref: sizeChartAssetId } } : null,
        };

        const newProduct = await client.create(product);

        res.status(200).json({ success: true, product: newProduct });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}