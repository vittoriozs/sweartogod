"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { motion, AnimatePresence } from "motion/react";
import { client } from "@/sanity/lib/client";
import NoProductAvailable from "./NoProductAvailable";
import { Loader2 } from "lucide-react";
import Container from "./Container";
import Link from "next/link";
import { Product } from "@/sanity.types";
import Title from "./Title";

const ProductGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const query = `*[_type == "product" && status == "hot"] 
    | order(name asc)[0...4]{
      ...,
      "categories": categories[]->title
    }`;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await client.fetch(query);
        setProducts(result);
      } catch (error) {
        console.log("Product fetching Error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Container className="flex flex-col lg:px-0 my-10">
      <div className="flex justify-between items-center mt-2">
        <Title>Featured Products</Title>

        <Link
          href={"/deals"}
          className="text-sm border border-dark-grey px-4 py-1 rounded-full hover:text-white hover:bg-dark-grey hover:border-dark-grey hoverEffect"
        >
          See all
        </Link>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 min-h-80 space-y-4 text-center bg-gray-100 rounded-lg w-full mt-7.5">
          <motion.div className="flex items-center space-x-2 text-black/80">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Product is loading...</span>
          </motion.div>
        </div>
      ) : products?.length ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-7.5">
          {products.map((product) => (
            <AnimatePresence key={product?._id}>
              <motion.div
                layout
                initial={{ opacity: 0.2 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ProductCard key={product?._id} product={product} />
              </motion.div>
            </AnimatePresence>
          ))}
        </div>
      ) : (
        <NoProductAvailable selectedTab="deals" />
      )}
    </Container>
  );
};

export default ProductGrid;
