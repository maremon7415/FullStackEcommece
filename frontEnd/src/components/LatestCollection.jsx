import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../contexts/ShopContextsProvider";
import Title from "./Title";
import ProductItem from "./ProductItem";
import Spinner from "../components/Spinner";

const LatestCollection = () => {
  const { products, loading } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    setLatestProducts(products.slice(0, 10));
  }, [products]);

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1="Latest" text2="Collection" />
        <p className="text-gray-500 text-xl">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
          quos.
        </p>
      </div>
      {/* rendering latest products  */}
      {loading ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {latestProducts.map((item, index) => (
            <ProductItem
              key={item._id}
              id={item._id}
              image={item.image[0].url}
              name={item.name}
              price={item.price}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LatestCollection;
