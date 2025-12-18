"use client";
import { cn } from "@/lib/utils";
import { Product } from "@/sanity.types";
import useStore from "@/store";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const AddToFavoriteButton = ({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) => {
  const { favoriteProduct, addToFavorite } = useStore();
  const [existingProduct, setExistingProduct] = useState<Product | null>(null);
  useEffect(() => {
    const availableProduct = favoriteProduct?.find(
      (item) => item?._id === product?._id
    );
    setExistingProduct(availableProduct || null);
  }, [product, favoriteProduct]);
  const handleFavorite = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    if (product?._id) {
      addToFavorite(product).then(() => {
        toast.success(
          existingProduct
            ? "Product removed successfully!"
            : "Product added successfully!"
        );
      });
    }
  };
  return (
    <div
      className={cn(
        "absolute top-2 right-2 z-10 hover:cursor-pointer",
        className
      )}
    >
      <div
        onClick={handleFavorite}
        className={`p-2.5 rounded-full hover:bg-red-500 hover:text-white hoverEffect ${existingProduct ? "bg-red-500 text-white" : "bg-transparent text-black"}`}
      >
        <Heart size={17} />
      </div>
    </div>
  );
};

export default AddToFavoriteButton;
