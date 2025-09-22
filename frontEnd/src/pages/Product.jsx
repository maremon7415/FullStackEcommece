import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../contexts/ShopContextsProvider";
import { IoMdStar, IoIosStarOutline } from "react-icons/io";
import RelatedProducts from "../components/RelatedProducts";
import { toast } from "react-toastify";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, token, navigate } =
    useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [productImage, setProductImage] = useState("");
  const [size, setSize] = useState("");

  const fetchProductData = () => {
    const foundProduct = products.find((item) => item._id === productId);
    if (foundProduct) {
      setProductData(foundProduct);
      setProductImage(foundProduct.image[0].url);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [products, productId]);

  const handleImageClick = (image) => {
    setProductImage(image.url);
  };
  const handleAddToCart = () => {
    if (!token) {
      navigate("/login");
      toast.error("Please Login or Create an Account");
    } else {
      addToCart(productData._id, size);
    }
  };

  return productData ? (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col lg:flex-row lg:space-x-12">
        {/* Product Images Section - Left Side */}
        <div className="w-full lg:w-1/2 flex flex-col sm:flex-row gap-4">
          {/* Thumbnail Images */}
          <div className="flex sm:flex-col gap-2 sm:w-20 lg:w-24 order-2 sm:order-1 overflow-x-auto sm:overflow-x-visible py-1 sm:py-0">
            {productData.image.map((img, index) => (
              <div
                key={index}
                onClick={() => handleImageClick(img)}
                className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 border transition-all duration-300 ease-in-out cursor-pointer ${
                  productImage === img
                    ? "border-black border-2"
                    : "border-gray-300 hover:border-gray-500"
                }`}
              >
                <img src={img.url} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          {/* Main Product Image */}
          <div className="flex-1 order-1 sm:order-2 border border-gray-300 overflow-hidden flex items-center justify-center">
            <img
              src={productImage}
              alt="Main Product"
              className="w-full h-auto object-cover"
              style={{ maxHeight: "min(70vh, 600px)" }}
            />
          </div>
        </div>

        {/* Product Details Section - Right Side */}
        <div className="w-full lg:w-1/2 mt-8 lg:mt-0">
          <h1 className="text-3xl md:text-4xl font-light mb-2">
            {productData.name}
          </h1>
          <div className="flex items-center text-gray-700 mb-4">
            <div className="flex text-lg text-yellow-500">
              <IoMdStar />
              <IoMdStar />
              <IoMdStar />
              <IoMdStar />
              <IoIosStarOutline />
            </div>
            <p className="pl-2 text-sm text-gray-500">(122 reviews)</p>
          </div>
          <p className="text-2xl md:text-3xl font-normal mb-6">
            {currency}
            {productData.price}
          </p>
          <p className="text-gray-600 mb-8 leading-relaxed md:w-4/5">
            {productData.description}
          </p>

          <div className="mb-8">
            <p className="text-sm font-medium mb-2">Select Size</p>
            <div className="flex flex-wrap gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSize(item)}
                  className={`w-12 h-12 flex items-center justify-center border transition-all duration-200 ease-in-out hover:border-black ${
                    size === item
                      ? "border-black bg-gray-100"
                      : "border-gray-300"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="bg-black text-white px-8 py-3 text-sm font-semibold uppercase tracking-wider transition-colors duration-300 ease-in-out hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
          >
            Add to Cart
          </button>

          <hr className="my-8 border-gray-200" />

          <div className="text-sm text-gray-500 space-y-2">
            <p>100% Original Product</p>
            <p>Cash on Delivery Available</p>
            <p>Easy return and replace policy within 7 days</p>
          </div>
        </div>
      </div>

      {/* Description and Review Section */}
      <div className="mt-16">
        <div className="flex border-b border-gray-300">
          <button className="px-6 py-3 text-sm font-medium border-b-2 border-black -mb-[1px]">
            Description
          </button>
          <button className="px-6 py-3 text-sm font-medium text-gray-500 hover:text-black">
            Reviews
          </button>
        </div>
        <div className="p-6 md:p-8 bg-gray-50 text-sm text-gray-600 leading-relaxed space-y-4">
          {productData.description}
        </div>
      </div>

      {/* Related Products Section */}
      <div className="mt-16">
        <RelatedProducts
          category={productData.category}
          subCategory={productData.subCategory}
        />
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center min-h-screen text-lg text-gray-500">
      Loading...
    </div>
  );
};

export default Product;
