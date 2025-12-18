import { client } from "@/sanity/lib/client";
import PriceFormatter from "@/components/PriceFormatter";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getOrder(orderNumber: string) {
  return client.fetch(
    `*[_type=="order" && orderNumber==$orderNumber][0]{
      orderNumber,
      invoice,
      customerName,
      email,
      orderDate,
      status,
      products[]{
        quantity,
        product->{
          name,
          price
        }
      },
      totalPrice,
      amountDiscount,
      currency
    }`,
    { orderNumber }
  );
}

export default async function InvoicePage({
  params,
}: {
  params: { orderNumber: string };
}) {
  const order = await getOrder(params.orderNumber);

  if (!order) return notFound();

  return (
    <div className="max-w-3xl mx-auto p-8 text-sm">
      <div className="flex justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Invoice</h1>
          <p className="text-gray-600">{order.invoice?.number}</p>
        </div>
        <div className="text-right">
          <p>
            <strong>Status:</strong> PAID
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(order.orderDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <p>
          <strong>Customer:</strong> {order.customerName}
        </p>
        <p>
          <strong>Email:</strong> {order.email}
        </p>
        <p>
          <strong>Order Number:</strong> {order.orderNumber}
        </p>
      </div>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">Product</th>
            <th className="border p-2">Qty</th>
            <th className="border p-2 text-right">Price</th>
          </tr>
        </thead>
        <tbody>
          {order.products.map((item: any, i: number) => (
            <tr key={i}>
              <td className="border p-2">{item.product.name}</td>
              <td className="border p-2 text-center">{item.quantity}</td>
              <td className="border p-2 text-right">
                <PriceFormatter amount={item.product.price} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 flex justify-end">
        <div className="w-64 space-y-2">
          {order.amountDiscount !== 0 && (
            <div className="flex justify-between">
              <span>Discount</span>
              <PriceFormatter amount={order.amountDiscount} />
            </div>
          )}
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <PriceFormatter amount={order.totalPrice} />
          </div>
        </div>
      </div>

      <div className="mt-10 text-right">
        <Link
          href={`/api/invoice/pdf?orderNumber=${order.orderNumber}`}
          className="inline-block border px-4 py-2 rounded hover:bg-gray-100"
        >
          Download Invoice (PDF)
        </Link>
      </div>
    </div>
  );
}
