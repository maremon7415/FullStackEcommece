import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../contexts/ShopContextsProvider";
import Title from "./Title";
import ProductItem from "./ProductItem";
import Spinner from "../components/Spinner";

const BestSeller = () => {
  const { products, loading } = useContext(ShopContext);
  const [BestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    const BestProduct = products.filter((product) => product.bestSeller);
    setBestSeller(BestProduct.slice(0, 5));
  }, [products]);

  return (
    <div className="my-10">
      <div className="text-3xl text-center py-8">
        <Title text1="Best" text2="Seller" />
        <p className="text-gray-500 text-xl">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
          quos.
        </p>
      </div>
      {/* rendering best seller products  */}
      {loading ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {BestSeller.map((item, index) => (
            <ProductItem
              key={index}
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

export default BestSeller;
