import { useState, useEffect } from "react";
import uploadImage from "../assets/upload_area.png";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";

const Add = ({ token }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [images, setImages] = useState([null, null, null, null]);
  const [sizes, setSizes] = useState([]);
  const [bestSeller, setBestSeller] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Clean up object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img && img.preview) URL.revokeObjectURL(img.preview);
      });
    };
  }, [images]);

  // Handle image selection
  const handleImageCng = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newImages = [...images];
      newImages[index] = file;
      setImages(newImages);
    }
  };

  // Handle size selection toggle
  const toggleSize = (size) => {
    if (sizes.includes(size)) {
      setSizes(sizes.filter((s) => s !== size));
    } else {
      setSizes([...sizes, size]);
    }
  };

  // Form validation
  const isFormValid =
    name.trim() &&
    description.trim() &&
    price &&
    images.some(Boolean) &&
    sizes.length > 0;

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      toast.error("Please fill all required fields and select sizes/images.");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", parseFloat(price));
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestSeller", bestSeller ? "true" : "false");

      // Send sizes as JSON string
      formData.append("sizes", JSON.stringify(sizes));

      // Append images
      images.forEach((img, i) => {
        if (img) formData.append(`image${i + 1}`, img);
      });

      const response = await axios.post(
        `${backendUrl}/api/product/add`,
        formData,
        { headers: { token: token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);

        // Reset form
        setName("");
        setDescription("");
        setPrice("");
        setCategory("Men");
        setSubCategory("Topwear");
        setImages([null, null, null, null]);
        setSizes([]);
        setBestSeller(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-12 my-4">
      <h2 className="text-2xl font-bold mb-4">Add Products</h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Images */}
        <div>
          <h2 className="text-lg mb-4">Upload Product Images</h2>
          <div className="flex gap-2 cursor-pointer">
            {[1, 2, 3, 4].map((item, index) => (
              <div
                key={index}
                className="w-[120px] h-[120px] border rounded flex items-center justify-center"
              >
                <label htmlFor={`image${index + 1}`}>
                  <img
                    src={
                      images[index]
                        ? URL.createObjectURL(images[index])
                        : uploadImage
                    }
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover cursor-pointer"
                  />
                  <input
                    type="file"
                    id={`image${index + 1}`}
                    name={`image${index + 1}`}
                    accept="image/*"
                    hidden
                    onChange={(e) => handleImageCng(e, index)}
                  />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Name */}
        <div className="w-full">
          <h2 className="text-lg mb-2">Product Name</h2>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-[80%] border px-4 py-2 focus:outline-none"
            type="text"
            placeholder="Product name"
            required
          />
        </div>

        {/* Description */}
        <div className="w-full">
          <h2 className="text-lg mb-2">Product Description</h2>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-[80%] border px-4 py-2 focus:outline-none"
            placeholder="Product description"
            required
          />
        </div>

        {/* Category & SubCategory */}
        <div className="flex gap-6">
          <div>
            <h2 className="text-lg mb-2">Category</h2>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-1 border focus:outline-none"
            >
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>
          <div>
            <h2 className="text-lg mb-2">Sub Category</h2>
            <select
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              className="px-4 py-1 border focus:outline-none"
            >
              <option value="Topwear">Topwear</option>
              <option value="Bottomwear">Bottomwear</option>
              <option value="Winterwear">Winterwear</option>
            </select>
          </div>

          {/* Sizes */}
          <div>
            <h2 className="text-lg mb-2">Sizes</h2>
            <div className="flex gap-2">
              {["S", "M", "L", "XL", "XXL"].map((item, index) => (
                <button
                  type="button"
                  key={index}
                  onClick={() => toggleSize(item)}
                  className={`px-3 py-1 border rounded ${
                    sizes.includes(item) ? "bg-black text-white" : ""
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div>
            <h2 className="text-lg mb-2">Price</h2>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              className="px-4 py-1 border focus:outline-none w-[120px]"
              placeholder="0.00"
              required
            />
          </div>
        </div>

        {/* Best Seller */}
        <div className="flex gap-2 items-center text-lg">
          <h2>Best Seller</h2>
          <input
            type="checkbox"
            checked={bestSeller}
            onChange={(e) => setBestSeller(e.target.checked)}
            className="h-4 w-4 border focus:outline-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!isFormValid || isLoading}
          className="bg-black text-lg text-white w-[160px] px-2 py-2 rounded disabled:opacity-50"
        >
          {isLoading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default Add;
