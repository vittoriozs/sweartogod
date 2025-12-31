import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import Title from "@/components/Title";
import { Product } from "@/sanity.types";
import { getAllProducts } from "@/sanity/queries";

const ProductPage = async () => {
  const products = await getAllProducts();

  return (
    <div className="my-5">
      <Container>
        <Title className="mb-6 uppercase tracking-wide">All Products</Title>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((product: Product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </Container>
    </div>
  );
};

export default ProductPage;
