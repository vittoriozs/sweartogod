"use client";

import { Product } from "@/sanity.types";
import React, { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { Loader2 } from "lucide-react";
import ProductCard from "./ProductCard";
import NoProductAvailable from "./NoProductAvailable";

interface Props {
  slug: string;
}

const CategoryProducts = ({ slug }: Props) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const isMainCategory = ["mens", "womens", "kids"].includes(slug);

  const fetchProducts = async () => {
    setLoading(true);

    try {
      let query = "";
      let params: any = {};

      if (slug === "featured") {
        query = `
          *[_type == "product" && isFeatured == true]{
            ...,
            categories[]->{ title, slug }
          }
        `;
      } else if (isMainCategory) {
        // ✅ SHOW ALL PRODUCTS PER CATEGORY (NO SUBCATEGORY)
        query = `
          *[_type == "product" && gender == $gender]{
            ...,
            categories[]->{ title, slug }
          }
        `;
        params = { gender: slug };
      }

      const data = await client.fetch(query, params);
      setProducts(data);
    } catch (error) {
      console.error(error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [slug]);

  return (
    <div className="mt-3 mb-6">
      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <NoProductAvailable className="mt-0 w-full" />
      )}
    </div>
  );
};

export default CategoryProducts;
