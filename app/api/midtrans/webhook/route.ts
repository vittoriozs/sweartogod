import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { backendClient } from "@/sanity/lib/backendClient";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      order_id,
      transaction_status,
      status_code,
      gross_amount,
      signature_key,
      transaction_id,
      payment_type,
    } = body;

    const payload = `${order_id}${status_code}${gross_amount}${process.env.MIDTRANS_SERVER_KEY}`;

    const expectedSignature = crypto
      .createHash("sha512")
      .update(payload)
      .digest("hex");

    if (signature_key !== expectedSignature) {
      console.error("Invalid Midtrans signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    const isPaid =
      transaction_status === "settlement" ||
      (transaction_status === "capture" && payment_type === "credit_card");

    if (!isPaid) {
      return NextResponse.json({ received: true });
    }

    const order = await backendClient.fetch(
      `*[_type=="order" && orderNumber==$orderId][0]{
        _id,
        status,
        products[] {
          quantity,
          product->{ _id }
        }
      }`,
      { orderId: order_id }
    );

    if (!order) {
      console.error("Order not found:", order_id);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status === "paid") {
      return NextResponse.json({ received: true });
    }

    for (const item of order.products) {
      await backendClient
        .patch(item.product._id)
        .dec({ stock: item.quantity })
        .commit();
    }

    await backendClient
      .patch(order._id)
      .set({
        status: "paid",
        midtransTransactionId: transaction_id,
        paymentType: payment_type,
      })
      .commit();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("MIDTRANS WEBHOOK ERROR:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
