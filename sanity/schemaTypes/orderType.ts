import { BasketIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import OrderStatusInput from "../components/OrderStatusInput";

export const orderType = defineType({
  name: "order",
  title: "Order",
  type: "document",
  icon: BasketIcon,
  fields: [
    defineField({
      name: "orderNumber",
      title: "Order Number",
      type: "string",
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),

    {
      name: "invoice",
      type: "object",
      fields: [
        { name: "number", type: "string", readOnly: true },
        { name: "hosted_invoice_url", type: "url", readOnly: true },
      ],
    },

    defineField({
      name: "paymentProvider",
      type: "string",
      initialValue: "midtrans",
      readOnly: true,
    }),
    defineField({
      name: "midtransTransactionId",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "paymentType",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "clerkUserId",
      title: "Store User ID",
      type: "string",
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "customerName",
      title: "Customer Name",
      type: "string",
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Customer Email",
      type: "string",
      readOnly: true,
      validation: (Rule) => Rule.required().email(),
    }),

    defineField({
      name: "products",
      title: "Products",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "product",
              title: "Product Bought",
              type: "reference",
              to: [{ type: "product" }],
            }),
            defineField({
              name: "quantity",
              title: "Quantity Purchased",
              type: "number",
            }),
          ],
          preview: {
            select: {
              product: "product.name",
              quantity: "quantity",
              image: "product.image",
              price: "product.price",
              currency: "product.currency",
            },
            prepare(select) {
              return {
                title: `${select.product} x ${select.quantity}`,
                subtitle: `${select.price * select.quantity}`,
                media: select.image,
              };
            },
          },
        }),
      ],
    }),

    defineField({
      name: "totalPrice",
      title: "Total Price",
      type: "number",
      readOnly: true,
      validation: (Rule) => Rule.required().min(0),
    }),

    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "amountDiscount",
      title: "Amount Discount",
      type: "number",
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "deliveryMethod",
      title: "Delivery Method",
      type: "string",
      readOnly: true,
      options: {
        list: [
          { title: "Delivery", value: "delivery" },
          { title: "Pick Up In Store", value: "pickup" },
        ],
      },
    }),

    defineField({
      name: "pickupLocation",
      title: "Pickup Location",
      type: "reference",
      to: [{ type: "pickupLocation" }],
      hidden: ({ document }) => document?.deliveryMethod !== "pickup",
      readOnly: true,
    }),

    defineField({
      name: "address",
      title: "Shipping Address",
      type: "object",
      hidden: ({ document }) => document?.deliveryMethod === "pickup",
      readOnly: true,
      fields: [
        defineField({ name: "name", title: "Recipient Name", type: "string" }),
        defineField({
          name: "address",
          title: "Full Address",
          type: "string",
          description: "Street, Number, RT/RW, Complex if any",
        }),
        defineField({
          name: "kelurahan",
          title: "Kelurahan",
          type: "string",
        }),
        defineField({
          name: "kecamatan",
          title: "Kecamatan",
          type: "string",
        }),
        defineField({
          name: "city",
          title: "City / Regency (Kota / Kabupaten)",
          type: "string",
        }),
        defineField({
          name: "province",
          title: "Province",
          type: "string",
        }),
        defineField({
          name: "postalCode",
          title: "Postal Code (Kode Pos)",
          type: "string",
        }),
      ],
    }),

    defineField({
      name: "status",
      title: "Order Status",
      type: "string",
      components: {
        input: OrderStatusInput,
      },
      validation: (Rule) =>
        Rule.custom((status, context) => {
          const method = context.document?.deliveryMethod;
          if (!method || !status) return true;

          if (
            method === "pickup" &&
            ["shipped", "delivered"].includes(status)
          ) {
            return "Invalid status for pickup order";
          }

          if (method === "delivery" && status === "ready_to_pick_up") {
            return "Invalid status for delivery order";
          }

          return true;
        }),
    }),

    defineField({
      name: "orderDate",
      title: "Order Date",
      type: "datetime",
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
  ],

  preview: {
    select: {
      name: "customerName",
      amount: "totalPrice",
      currency: "currency",
      orderId: "orderNumber",
      email: "email",
    },
    prepare(select) {
      const orderIdSnippet = `${select.orderId.slice(0, 5)}...${select.orderId.slice(-5)}`;
      return {
        title: `${select.name} (${orderIdSnippet})`,
        subtitle: `${select.amount} ${select.currency}, ${select.email}`,
        media: BasketIcon,
      };
    },
  },
});
