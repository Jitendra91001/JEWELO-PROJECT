import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Array<{
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    images: string[];
    rating?: number;
    material?: string;
  }>;
  columns?: 2 | 3 | 4;
}

const ProductGrid = ({ products, columns = 4 }: ProductGridProps) => {
  const colClass = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  }[columns];

  return (
    <div className={`grid ${colClass} gap-4 lg:gap-6`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          price={product.price}
          originalPrice={product.originalPrice}
          image={product.images[0]}
          rating={product.rating}
          material={product.material}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
