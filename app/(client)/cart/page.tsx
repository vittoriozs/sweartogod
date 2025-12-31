"use client";

import { createOrder } from "@/app/actions/createOrder";
import { createMidtransTransaction } from "@/app/actions/createMidtrans";
import AddToFavoriteButton from "@/components/AddToFavoriteButton";
import Container from "@/components/Container";
import EmptyCart from "@/components/EmptyCart";
import NoAccess from "@/components/NoAccess";
import PriceFormatter from "@/components/PriceFormatter";
import QuantityButtons from "@/components/QuantityButtons";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Address } from "@/sanity.types";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import useStore from "@/store";
import { useAuth, useUser } from "@clerk/nextjs";
import { Phone, ShoppingBag, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

type PickupLocation = {
  _id: string;
  name: string;
  address: string;
  city?: string;
  phone?: string;
};

const CartPage = () => {
  const {
    deleteCartProduct,
    getTotalPrice,
    getItemCount,
    getSubTotalPrice,
    resetCart,
  } = useStore();
  const [loading, setLoading] = useState(false);
  const groupedItems = useStore((state) => state.getGroupedItems());
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [addresses, setAddresses] = useState<Address[] | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "pickup">(
    "delivery"
  );
  const [pickupLocations, setPickupLocations] = useState<PickupLocation[]>([]);
  const [selectedPickup, setSelectedPickup] = useState<PickupLocation | null>(
    null
  );

  const [openAddressModal, setOpenAddressModal] = useState(false);

  const [newAddress, setNewAddress] = useState({
    name: "",
    address: "",
    kelurahan: "",
    kecamatan: "",
    city: "",
    province: "",
    postalCode: "",
    default: false,
  });

  const fetchAddresses = async () => {
    if (!user?.emailAddresses?.[0]?.emailAddress) return;

    setLoading(true);
    try {
      const email = user.emailAddresses[0].emailAddress;

      const query = `
      *[_type=="address" && email==$email]
      | order(default desc, createdAt desc)
    `;

      const data: Address[] = await client.fetch(query, { email });

      setAddresses(data);

      const defaultAddress = data.find((addr) => addr.default);
      setSelectedAddress(defaultAddress ?? data[0] ?? null);
    } catch (error) {
      console.error("Addresses fetching error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (deliveryMethod !== "pickup") return;

    const fetchPickupLocations = async () => {
      const data: PickupLocation[] = await client.fetch(
        `*[_type=="pickupLocation" && active==true]`
      );

      // Custom order array
      const customOrder = [
        "Vanna Lévourla Maison",
        "Vanna Lévourla Atelier",
        "Vanna Lévourla Boutique",
      ];

      // Urutkan sesuai customOrder, yang tidak ada di array tetap di belakang
      const sortedData = data.sort((a, b) => {
        const indexA = customOrder.indexOf(a.name);
        const indexB = customOrder.indexOf(b.name);
        if (indexA === -1 && indexB === -1) return 0;
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      });

      setPickupLocations(sortedData);
      setSelectedPickup(sortedData?.[0] ?? null);
    };

    fetchPickupLocations();
  }, [deliveryMethod]);

  useEffect(() => {
    if (user) fetchAddresses();
  }, [user]);
  const handleResetCart = () => {
    const confirmed = window.confirm(
      "Are you sure you want to reset your cart?"
    );
    if (confirmed) {
      resetCart();
      toast.success("Cart reset successfully!");
    }
  };

  const handleAddAddress = async () => {
    if (!user?.emailAddresses?.[0]?.emailAddress) {
      toast.error("User email not found");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newAddress,
          email: user.emailAddresses[0].emailAddress,
        }),
      });

      if (!res.ok) throw new Error();

      toast.success("Address added successfully");

      setOpenAddressModal(false);
      setNewAddress({
        name: "",
        address: "",
        kelurahan: "",
        kecamatan: "",
        city: "",
        province: "",
        postalCode: "",
        default: false,
      });

      fetchAddresses();
    } catch {
      toast.error("Failed to add address");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!groupedItems.length) return;

    if (!user?.id || !user.emailAddresses?.[0]?.emailAddress) {
      toast.error("Please sign in before checkout");
      return;
    }

    if (deliveryMethod === "delivery" && !selectedAddress) {
      toast.error("Please select a shipping address");
      return;
    }

    if (deliveryMethod === "pickup" && !selectedPickup) {
      toast.error("Please select a pickup location");
      return;
    }

    setLoading(true);

    try {
      const orderItems = groupedItems.map(({ product, quantity }) => {
        if (typeof product.price !== "number") {
          throw new Error(`Invalid price for product ${product._id}`);
        }

        return {
          product: {
            _id: product._id,
            price: product.price,
          },
          quantity,
        };
      });

      const midtransItems = groupedItems.map(({ product, quantity }) => {
        if (typeof product.price !== "number") {
          throw new Error(`Invalid price for product ${product._id}`);
        }

        return {
          product: {
            _id: product._id,
            name: product.name ?? "Product",
            price: product.price,
          },
          quantity,
        };
      });

      const { orderNumber } = await createOrder({
        items: orderItems,
        deliveryMethod,
        pickupLocationId:
          deliveryMethod === "pickup" ? selectedPickup!._id : null,
        customer: {
          clerkUserId: user.id,
          name: user.fullName ?? "Customer",
          email: user.emailAddresses[0].emailAddress,
          address: selectedAddress,
        },
      });

      const { token } = await createMidtransTransaction({
        items: midtransItems,
        orderNumber,
        deliveryMethod,
        customer: {
          name: user.fullName ?? "Customer",
          email: user.emailAddresses[0].emailAddress,
          clerkUserId: user.id,
        },
      });

      // @ts-ignore
      window.snap.pay(token, {
        onSuccess: () => {
          toast.success("Payment successful");
          resetCart();
          window.top!.location.href = `/success?orderNumber=${orderNumber}`;
        },
        onPending: () => toast("Waiting for payment"),
        onError: () => toast.error("Payment failed"),
        onClose: () => toast("Payment popup closed"),
      });
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 pb-15 md:pb-10">
      {isSignedIn ? (
        <Container>
          {groupedItems?.length ? (
            <>
              <div className="flex items-center gap-2 py-5">
                <ShoppingBag className="text-darkColor" />
                <Title>Shopping Cart</Title>
              </div>
              <div className="grid lg:grid-cols-3 md:gap-8">
                <div className="lg:col-span-2 rounded-lg">
                  <div className="border bg-white rounded-md">
                    {groupedItems?.map(({ product }) => {
                      const itemCount = getItemCount(product?._id);
                      return (
                        <div
                          key={product?._id}
                          className="border-b p-2.5 last:border-b-0 flex items-center justify-between gap-5"
                        >
                          <div className="flex flex-1 items-start gap-2 h-36 md:h-44">
                            {product?.images && (
                              <Link
                                href={`/product/${product?.slug?.current}`}
                                className="border p-0.5 md:p-1 mr-2 rounded-md
                                 overflow-hidden group"
                              >
                                <Image
                                  src={urlFor(product?.images[0]).url()}
                                  alt="productImage"
                                  width={500}
                                  height={500}
                                  loading="lazy"
                                  className="w-32 md:w-40 h-32 md:h-40 object-cover group-hover:scale-105 hoverEffect"
                                />
                              </Link>
                            )}
                            <div className="h-full flex flex-1 flex-col justify-between py-1">
                              <div className="flex flex-col gap-0.5 md:gap-1.5">
                                <h2 className="text-base font-semibold line-clamp-1">
                                  {product?.name}
                                </h2>
                              </div>
                              <div className="flex items-center gap-2">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <AddToFavoriteButton
                                        product={product}
                                        className="relative top-0 right-0"
                                      />
                                    </TooltipTrigger>
                                    <TooltipContent className="font-bold">
                                      Add to Favorite
                                    </TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Trash
                                        onClick={() => {
                                          deleteCartProduct(product?._id);
                                          toast.success(
                                            "Product deleted successfully!"
                                          );
                                        }}
                                        className="w-4 h-4 md:w-5 md:h-5 mr-1 text-gray-500 hover:text-red-600 hoverEffect"
                                      />
                                    </TooltipTrigger>
                                    <TooltipContent className="font-bold bg-red-600">
                                      Delete product
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-start justify-between h-36 md:h-44 p-0.5 md:p-1">
                            <PriceFormatter
                              amount={(product?.price ?? 0) * itemCount}
                              className="font-bold text-lg"
                            />
                            <QuantityButtons product={product} />
                          </div>
                        </div>
                      );
                    })}
                    <Button
                      onClick={handleResetCart}
                      className="m-5 font-semibold"
                      variant="destructive"
                    >
                      Reset Cart
                    </Button>
                  </div>
                </div>

                {/* Address & Checkout */}
                <div>
                  <div className="lg:col-span-1">
                    <div className="hidden md:inline-block w-full bg-white p-6 rounded-lg border">
                      <h2 className="text-xl font-semibold mb-4">
                        Order Summary
                      </h2>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span>SubTotal</span>
                          <PriceFormatter amount={getSubTotalPrice()} />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Discount</span>
                          <PriceFormatter
                            amount={getSubTotalPrice() - getTotalPrice()}
                          />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between font-semibold text-lg">
                          <span>Total</span>
                          <PriceFormatter
                            amount={getTotalPrice()}
                            className="text-lg font-bold text-black"
                          />
                        </div>
                        <Button
                          className="w-full rounded-full font-semibold tracking-wide hoverEffect"
                          size="lg"
                          disabled={loading}
                          onClick={handleCheckout}
                        >
                          {loading ? "Please wait..." : "Proceed to Checkout"}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-md my-5">
                    <Card>
                      <CardHeader>
                        <CardTitle>Delivery Method</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <RadioGroup
                          value={deliveryMethod}
                          onValueChange={(v) =>
                            setDeliveryMethod(v as "delivery" | "pickup")
                          }
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="delivery" />
                            <Label>Home Delivery</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="pickup" />
                            <Label>Pick Up in Store</Label>
                          </div>
                        </RadioGroup>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="bg-white rounded-md my-5">
                    {deliveryMethod === "pickup" &&
                      pickupLocations.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle>Pick Up Location</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <RadioGroup
                              value={selectedPickup?._id}
                              onValueChange={(id) =>
                                setSelectedPickup(
                                  pickupLocations.find((l) => l._id === id) ||
                                    null
                                )
                              }
                            >
                              {pickupLocations.map((loc) => (
                                <div
                                  key={loc._id}
                                  className="flex items-start space-x-2 mb-4"
                                >
                                  <RadioGroupItem value={loc._id} />
                                  <Label className="grid gap-1">
                                    <span className="font-semibold">
                                      {loc.name}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                      {loc.address}, {loc.city}
                                    </span>
                                    {loc.phone && (
                                      <span className="flex items-center gap-1">
                                        <Phone size={15} /> {loc.phone}
                                      </span>
                                    )}
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </CardContent>
                        </Card>
                      )}
                  </div>
                  {deliveryMethod === "delivery" && addresses && (
                    <div className="bg-white rounded-md mt-5">
                      <Card>
                        <CardHeader>
                          <CardTitle>Delivery Address</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <RadioGroup
                            value={selectedAddress?._id}
                            onValueChange={(id) =>
                              setSelectedAddress(
                                addresses.find((addr) => addr._id === id) ??
                                  null
                              )
                            }
                          >
                            {addresses?.map((address) => (
                              <div
                                key={address?._id}
                                onClick={() => setSelectedAddress(address)}
                                className={`flex items-center space-x-2 mb-4 cursor-pointer ${selectedAddress?._id === address?._id && "text-shop_dark_green"}`}
                              >
                                <RadioGroupItem value={address?._id} />
                                <Label
                                  htmlFor={`address-${address?._id}`}
                                  className="grid gap-1.5 flex-1"
                                >
                                  <span className="font-semibold">
                                    {address?.name}
                                  </span>
                                  <span className="text-sm text-black/60">
                                    {address.address}, {address.city},{" "}
                                    {address.province} {address.postalCode}
                                  </span>
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                          <Button
                            variant="outline"
                            className="w-full mt-4"
                            onClick={() => setOpenAddressModal(true)}
                          >
                            Add New Address
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>

                {/* Mobile View */}
                <div className="md:hidden fixed bottom-0 left-0 w-full bg-white pt-5 z-50">
                  <div className="bg-white p-4 rounded-lg border mx-4">
                    <h2>Order Summary</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>SubTotal</span>
                        <PriceFormatter amount={getSubTotalPrice()} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Discount</span>
                        <PriceFormatter
                          amount={getSubTotalPrice() - getTotalPrice()}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between font-semibold text-lg">
                        <span>Total</span>
                        <PriceFormatter
                          amount={getTotalPrice()}
                          className="text-lg font-bold text-black"
                        />
                      </div>
                      <Button
                        className="w-full rounded-full font-semibold tracking-wide hoverEffect"
                        size="lg"
                        disabled={loading}
                        onClick={handleCheckout}
                      >
                        {loading ? "Please wait..." : "Proceed to Checkout"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <EmptyCart />
          )}
        </Container>
      ) : (
        <NoAccess />
      )}
      <Dialog open={openAddressModal} onOpenChange={setOpenAddressModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
          </DialogHeader>

          <div className="grid gap-3">
            <Input
              placeholder="Address Name (Home, Office)"
              value={newAddress.name}
              onChange={(e) =>
                setNewAddress({ ...newAddress, name: e.target.value })
              }
            />

            <Input
              placeholder="Full Address"
              value={newAddress.address}
              onChange={(e) =>
                setNewAddress({ ...newAddress, address: e.target.value })
              }
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Kelurahan"
                value={newAddress.kelurahan}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, kelurahan: e.target.value })
                }
              />
              <Input
                placeholder="Kecamatan"
                value={newAddress.kecamatan}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, kecamatan: e.target.value })
                }
              />
            </div>

            <Input
              placeholder="City / Regency"
              value={newAddress.city}
              onChange={(e) =>
                setNewAddress({ ...newAddress, city: e.target.value })
              }
            />

            <Input
              placeholder="Province"
              value={newAddress.province}
              onChange={(e) =>
                setNewAddress({ ...newAddress, province: e.target.value })
              }
            />

            <Input
              placeholder="Postal Code"
              value={newAddress.postalCode}
              onChange={(e) =>
                setNewAddress({ ...newAddress, postalCode: e.target.value })
              }
            />

            <div className="flex items-center gap-2">
              <Checkbox
                checked={newAddress.default}
                onCheckedChange={(v) =>
                  setNewAddress({ ...newAddress, default: Boolean(v) })
                }
              />
              <Label>Set as default address</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenAddressModal(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddAddress} disabled={loading}>
              {loading ? "Saving..." : "Save Address"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CartPage;
