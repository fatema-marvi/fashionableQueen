const cartSchema = {
    name: "cart",
    type: "document",
    title: "Cart",
    fields: [
      {
        name: "userId",
        type: "string",
        title: "User ID",
        description: "ID of the user who owns this cart",
      },
      {
        name: "items",
        type: "array",
        title: "Cart Items",
        of: [
          {
            type: "object",
            fields: [
              {
                name: "productId",
                type: "string",
                title: "Product ID",
              },
              {
                name: "name",
                type: "string",
                title: "Product Name",
              },
              {
                name: "price",
                type: "number",
                title: "Price",
              },
              {
                name: "quantity",
                type: "number",
                title: "Quantity",
                initialValue: 1,
              },
              {
                name: "imageUrl",
                type: "string",
                title: "Product Image",
              },
              {
                name: "selectedSize",
                type: "string",
                title: "Selected Size",
              },
              {
                name: "selectedColor",
                type: "string",
                title: "Selected Color",
              },
            ],
          },
        ],
      },
    ],
  };
  
  export default cartSchema;
  