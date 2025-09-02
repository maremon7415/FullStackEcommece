import axios from "axios";
import { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";

const List = ({ token }) => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`, {
        headers: { token },
      });
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id },
        { headers: { token } } // FIX 1: Correctly formatted headers
      );
      // FIX 2: Check for 'success' property, not 'true'
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchProducts();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="bg-white min-h-screen pb-8 pt-4 px-4 sm:px-6 lg:px-8">
      <p className="mb-4 text-xl font-semibold text-gray-900">
        All Product List
      </p>

      <div className="flex flex-col gap-2">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center px-4 py-2 border-b border-gray-300 bg-gray-900 text-white text-sm font-semibold">
          <p>Image</p>
          <p>Name</p>
          <p>Category</p>
          <p>Price</p>
          <p className="text-center">Action</p>
        </div>

        {/* Product Rows */}
        {products.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-4 md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-3 px-4 border border-gray-200 rounded-md hover:shadow-md transition-shadow text-gray-900"
          >
            <img
              className="w-12 h-12 object-cover rounded"
              src={item.image[0].url}
              alt={item.name}
            />
            <p className="font-medium">{item.name}</p>
            <p>{item.category}</p>
            <p>
              {currency}
              {item.price}
            </p>
            <div className="flex justify-center gap-2">
              <button className="px-2 py-1 bg-black text-white rounded hover:bg-gray-800 text-xs">
                Edit
              </button>
              <button
                onClick={() => removeProduct(item._id)}
                className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
