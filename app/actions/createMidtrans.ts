"use server";

import Midtrans from "midtrans-client";

export async function createMidtransTransaction({
  items,
  orderNumber,
  customer,
  deliveryMethod,
}: {
  items: {
    product: {
      _id: string;
      name: string;
      price: number;
    };
    quantity: number;
  }[];
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    clerkUserId: string;
  };
  deliveryMethod: "delivery" | "pickup";
}) {
  const itemDetails = items.map((item) => ({
    id: item.product._id,
    name: item.product.name,
    price: Number(item.product.price),
    quantity: Number(item.quantity),
  }));

  const grossAmount = itemDetails.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const snap = new Midtrans.Snap({
    isProduction: process.env.NEXT_PUBLIC_MIDTRANS_ENV === "production",
    serverKey: process.env.MIDTRANS_SERVER_KEY!,
  });

  const transaction = await snap.createTransaction({
    transaction_details: {
      order_id: orderNumber,
      gross_amount: grossAmount,
    },

    item_details: itemDetails,

    customer_details: {
      first_name: customer.name,
      email: customer.email,
    },

    custom_field1: customer.clerkUserId,
    custom_field2: orderNumber,
    custom_field3: deliveryMethod,
  });

  return {
    token: transaction.token,
  };
}
