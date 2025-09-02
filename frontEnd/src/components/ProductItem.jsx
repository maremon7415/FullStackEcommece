import { useContext } from "react";
import { ShopContext } from "../contexts/ShopContextsProvider";
import { Link } from "react-router-dom";

const ProductItem = ({ index, id, image, name, price }) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link
      key={index}
      to={`/products/${id}`}
      className="block text-gray-800 focus:outline-none focus:ring-2 focus:ring-opacity-50"
    >
      <div className="overflow-hidden bg-gray-50 shadow-md transition-shadow duration-300 hover:shadow-lg group ">
        <div className="relative pb-[125%] overflow-hidden">
          {/* Aspect ratio container */}
          <img
            src={image}
            alt={name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>

        <div className="p-4">
          <h3 className="mb-1 truncate text-lg font-medium text-gray-900 transition-colors duration-200 hover:text-gray-700">
            {name}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold">
              {price} {currency}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;
