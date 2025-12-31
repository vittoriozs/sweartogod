import CategoryProducts from "@/components/CategoryProducts";
import Container from "@/components/Container";
import Title from "@/components/Title";

const mainCategories = ["featured", "mens", "womens", "kids"];

export default async function CategoryPage({ params }: any) {
  const { slug } = await params;

  return (
    <div className="py-3">
      <Container>
        <Title className="uppercase tracking-wide mb-5">{slug}</Title>

        <CategoryProducts slug={slug} />
      </Container>
    </div>
  );
}
