"use client";

import { MY_ORDERS_QUERYResult } from "@/sanity.types";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import PriceFormatter from "./PriceFormatter";
import { getOrderStatusClass } from "@/lib/orderStatus";
import { Store, Truck } from "lucide-react";

interface OrderDetailsDialogProps {
  order: MY_ORDERS_QUERYResult[number] | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailDialog: React.FC<OrderDetailsDialogProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!order) return null;

  const hasInvoice = !!order.invoice?.number;
  const totalPrice = order.totalPrice ?? 0;
  const amountDiscount = order.amountDiscount ?? 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl! max-h-[90vh] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Order Details - {order.orderNumber}</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-1">
          <p>
            <strong>Customer:</strong> {order.customerName}
          </p>
          <p>
            <strong>Email:</strong> {order.email}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {order.orderDate
              ? new Date(order.orderDate).toLocaleDateString()
              : "-"}
          </p>
          <p className="flex items-center gap-2">
            <strong>Delivery Method:</strong>{" "}
            {order.deliveryMethod && (
              <span className="flex items-center gap-1 text-sm font-medium">
                {order.deliveryMethod === "pickup" ? (
                  <>
                    <Store size={18} />
                    Pickup
                  </>
                ) : (
                  <>
                    <Truck size={18} />
                    Delivery
                  </>
                )}
              </span>
            )}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${getOrderStatusClass(order.status)}`}
            >
              {order.status?.replaceAll("_", " ")}
            </span>
          </p>
          <p>
            <strong>Invoice Number:</strong>{" "}
            {hasInvoice ? order.invoice!.number : "Not available"}
          </p>

          {hasInvoice && (
            <Button
              asChild
              className="bg-transparent border text-black/80 mt-2 hover:text-black hover:border-black hover:bg-black/10 hoverEffect"
            >
              <Link
                href={`/api/invoice/pdf?orderNumber=${order.orderNumber}`}
                target="_blank"
              >
                Download Invoice
              </Link>
            </Button>
          )}
        </div>

        <Table className="mt-6">
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {order.products?.map((product, index) => (
              <TableRow key={index}>
                <TableCell className="flex items-center gap-2">
                  {product?.product?.images?.[0] && (
                    <Image
                      src={urlFor(product.product.images[0]).url()}
                      alt="productImage"
                      width={50}
                      height={50}
                      className="border rounded-sm"
                    />
                  )}
                  {product?.product?.name}
                </TableCell>

                <TableCell>{product?.quantity}</TableCell>

                <TableCell>
                  <PriceFormatter
                    amount={product?.product?.price}
                    className="text-black font-medium"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-4 text-right flex justify-end">
          <div className="w-44 flex flex-col gap-1">
            {amountDiscount > 0 && (
              <>
                <div className="flex justify-between">
                  <strong>Discount:</strong>
                  <PriceFormatter amount={amountDiscount} />
                </div>

                <div className="flex justify-between">
                  <strong>Subtotal:</strong>
                  <PriceFormatter amount={totalPrice + amountDiscount} />
                </div>
              </>
            )}

            <div className="flex justify-between">
              <strong>Total:</strong>
              <PriceFormatter amount={totalPrice} className="font-bold" />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailDialog;
