"use server";

import crypto from "crypto";
import { backendClient } from "@/sanity/lib/backendClient";

export async function createOrder({
  items,
  customer,
  deliveryMethod,
  pickupLocationId,
}: {
  items: {
    product: { _id: string; price: number };
    quantity: number;
  }[];
  customer: {
    clerkUserId: string;
    name: string;
    email: string;
    address: any | null;
  };
  deliveryMethod: "delivery" | "pickup";
  pickupLocationId: string | null;
}) {
  const orderNumber = crypto.randomUUID();

  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const invoiceNumber = `INV-${orderNumber.slice(-8).toUpperCase()}`;

  const order = await backendClient.create({
    _type: "order",
    orderNumber,

    invoice: {
      number: invoiceNumber,
      hosted_invoice_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/invoice/pdf?orderNumber=${orderNumber}`,
    },

    clerkUserId: customer.clerkUserId,
    customerName: customer.name,
    email: customer.email,
    deliveryMethod,

    ...(deliveryMethod === "pickup" && pickupLocationId
      ? {
          pickupLocation: {
            _type: "reference",
            _ref: pickupLocationId,
          },
        }
      : {}),

    ...(deliveryMethod === "delivery" && customer.address
      ? {
          address: {
            name: customer.address.name,
            address: customer.address.address,
            kelurahan: customer.address.kelurahan,
            kecamatan: customer.address.kecamatan,
            city: customer.address.city,
            province: customer.address.province,
            postalCode: customer.address.postalCode,
          },
        }
      : {}),

    products: items.map((item) => ({
      _key: crypto.randomUUID(),
      product: {
        _type: "reference",
        _ref: item.product._id,
      },
      quantity: item.quantity,
    })),

    totalPrice,
    currency: "IDR",
    amountDiscount: 0,
    status: "pending",
    paymentProvider: "midtrans",
    orderDate: new Date().toISOString(),
  });

  return {
    orderNumber,
    sanityOrderId: order._id,
  };
}
