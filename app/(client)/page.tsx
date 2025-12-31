import Container from "@/components/Container";
import Hero from "@/components/Hero";
import LatestBlog from "@/components/LatestBlog";
import ProductGrid from "@/components/ProductGrid";
import React from "react";

const Home = () => {
  return (
    <>
      <Hero />
      <Container>
        <ProductGrid />
        <LatestBlog />
      </Container>
    </>
  );
};

export default Home;
