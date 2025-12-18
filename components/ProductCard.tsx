import { Product } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import PriceView from "./PriceView";
import Title from "./Title";
import AddToCartButton from "./AddToCartButton";
import AddToFavoriteButton from "./AddToFavoriteButton";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="text-sm border-1px rounded-md border-dark-blue/20 group bg-white">
      <div className="relative group overflow-hidden bg-lighter-grey">
        {product?.images && (
          <Link href={`/product/${product?.slug?.current}`}>
            <Image
              src={urlFor(product.images[0]).url()}
              alt="productImage"
              width={500}
              height={500}
              priority
              className={`w-full h-full object-cover overflow-hidden transition-transform bg-lighter-grey duration-500 
              ${product?.stock !== 0 ? "group-hover:scale-105" : "opacity-50"}`}
            />
          </Link>
        )}
        <AddToFavoriteButton product={product} />
      </div>
      <div className="p-3 flex flex-col gap-2">
        {product?.categories && product.categories.length > 0 && (
          <p className="uppercase line-clamp-1 text-xs font-medium text-lightText">
            {product.categories.join(", ")}
          </p>
        )}

        <Title className="text-sm line-clamp-1">{product?.name}</Title>
        <div className="flex items-center gap-2.5">
          <p className="font-medium">In Stock</p>
          <p
            className={`${product?.stock === 0 ? "text-red-600" : "text-dark-grey font-semibold"}`}
          >
            {(product?.stock as number) > 0 ? product?.stock : "unavailable"}
          </p>
        </div>

        <PriceView
          price={product?.price}
          discount={product?.discount}
          className="text-sm"
        />
        <AddToCartButton product={product} className="w-36 rounded-full" />
      </div>
    </div>
  );
};

export default ProductCard;
