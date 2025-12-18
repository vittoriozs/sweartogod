import { backendClient } from "@/sanity/lib/backendClient";
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";

async function getOrder(orderNumber: string) {
  return backendClient.fetch(
    `*[_type=="order" && orderNumber==$orderNumber][0]{
      orderNumber,
      invoice,
      customerName,
      email,
      orderDate,
      products[] {
        quantity,
        product->{
          name,
          price
        }
      },
      totalPrice
    }`,
    { orderNumber }
  );
}

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11 },
  title: { fontSize: 18, marginBottom: 10 },
  section: { marginBottom: 10 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  header: { fontWeight: "bold", marginTop: 10, marginBottom: 4 },
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderNumber = searchParams.get("orderNumber");

  if (!orderNumber) {
    return new Response(JSON.stringify({ error: "Missing orderNumber" }), {
      status: 400,
    });
  }

  const order = await getOrder(orderNumber);

  if (!order) {
    return new Response(JSON.stringify({ error: "Order not found" }), {
      status: 404,
    });
  }

  const document = React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: "A4", style: styles.page },
      React.createElement(Text, { style: styles.title }, "Invoice"),

      React.createElement(
        View,
        { style: styles.section },
        React.createElement(
          Text,
          null,
          `Invoice Number: ${order.invoice.number}`
        ),
        React.createElement(Text, null, `Order Number: ${order.orderNumber}`),
        React.createElement(
          Text,
          null,
          `Date: ${new Date(order.orderDate).toLocaleDateString()}`
        ),
        React.createElement(Text, null, "Status: PAID")
      ),

      React.createElement(
        View,
        { style: styles.section },
        React.createElement(Text, null, `Customer: ${order.customerName}`),
        React.createElement(Text, null, `Email: ${order.email}`)
      ),

      React.createElement(Text, { style: styles.header }, "Items"),

      ...order.products.map((item: any, index: number) =>
        React.createElement(
          View,
          { key: index, style: styles.row },
          React.createElement(
            Text,
            null,
            `${item.product.name} × ${item.quantity}`
          ),
          React.createElement(Text, null, `IDR ${item.product.price}`)
        )
      ),

      React.createElement(
        View,
        { style: { marginTop: 12 } },
        React.createElement(Text, null, `Total: IDR ${order.totalPrice}`)
      )
    )
  );

  const stream = await pdf(document).toBuffer();

  return new Response(stream as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${order.invoice.number}.pdf"`,
    },
  });
}
