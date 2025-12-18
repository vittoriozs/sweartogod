import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { backendClient } from "@/sanity/lib/backendClient";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, user, address } = body;

    if (!items?.length) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    const orderNumber = `ORDER-${Date.now()}`;

    const totalPrice = items.reduce(
      (sum: number, item: any) =>
        sum + (item.product.price ?? 0) * item.quantity,
      0
    );

    const order = await backendClient.create({
      _type: "order",
      orderNumber,

      customerName: user.name,
      email: user.email,
      clerkUserId: user.id,

      paymentProvider: "midtrans",
      totalPrice,
      amountDiscount: 0,
      currency: "IDR",

      status: "pending",
      orderDate: new Date().toISOString(),

      products: items.map((item: any) => ({
        _key: crypto.randomUUID(),
        product: {
          _type: "reference",
          _ref: item.product._id,
        },
        quantity: item.quantity,
      })),

      address,
    });

    return NextResponse.json({
      orderId: order._id,
      orderNumber,
      totalPrice,
    });
  } catch (error) {
    console.error("CHECKOUT ERROR:", error);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
