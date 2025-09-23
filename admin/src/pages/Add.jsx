import { useState, useEffect } from "react";
import uploadImage from "../assets/upload_area.png";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";

const Add = ({ token }) => {
  // ---------------- STATE ----------------
  const [name, setName] = useState(""); // Product name
  const [description, setDescription] = useState(""); // Product description
  const [price, setPrice] = useState(""); // Product price
  const [category, setCategory] = useState("Men"); // Default category
  const [subCategory, setSubCategory] = useState("Topwear"); // Default sub-category
  const [images, setImages] = useState([null, null, null, null]); // Up to 4 product images
  const [sizes, setSizes] = useState([]); // Selected product sizes
  const [bestSeller, setBestSeller] = useState(false); // Best seller toggle
  const [isLoading, setIsLoading] = useState(false); // Loader for form submit

  // ---------------- EFFECT: CLEANUP ----------------
  // Clean up object URLs to avoid memory leaks when images change
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img && img.preview) URL.revokeObjectURL(img.preview);
      });
    };
  }, [images]);

  // ---------------- HANDLERS ----------------

  // Handle image selection for each upload box
  const handleImageCng = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newImages = [...images];
      newImages[index] = file;
      setImages(newImages);
    }
  };

  // Toggle sizes on/off
  const toggleSize = (size) => {
    if (sizes.includes(size)) {
      setSizes(sizes.filter((s) => s !== size));
    } else {
      setSizes([...sizes, size]);
    }
  };

  // Basic form validation before submit
  const isFormValid =
    name.trim() &&
    description.trim() &&
    price &&
    images.some(Boolean) && // At least 1 image must be uploaded
    sizes.length > 0; // At least 1 size selected

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // If validation fails, show error
    if (!isFormValid) {
      toast.error("Please fill all required fields and select sizes/images.");
      return;
    }

    setIsLoading(true);
    try {
      // Prepare form data for backend
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", parseFloat(price));
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestSeller", bestSeller ? "true" : "false");

      // Send sizes as JSON string
      formData.append("sizes", JSON.stringify(sizes));

      // Append all images if available
      images.forEach((img, i) => {
        if (img) formData.append(`image${i + 1}`, img);
      });

      // API request
      const response = await axios.post(
        `${backendUrl}/api/product/add`,
        formData,
        { headers: { token } }
      );

      // Handle response
      if (response.data.success) {
        toast.success(response.data.message);

        // Reset form after successful submit
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
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="mx-12 my-4">
      <h2 className="text-2xl font-bold mb-4">Add Products</h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* ---------- Image Upload Section ---------- */}
        <div>
          <h2 className="text-lg mb-4">Upload Product Images</h2>
          <div className="flex gap-2 cursor-pointer">
            {[1, 2, 3, 4].map((_, index) => (
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

        {/* ---------- Product Name ---------- */}
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

        {/* ---------- Product Description ---------- */}
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

        {/* ---------- Category & SubCategory ---------- */}
        <div className="flex gap-6">
          {/* Category */}
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

          {/* SubCategory */}
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
              {["S", "M", "L", "XL", "XXL"].map((size, index) => (
                <button
                  type="button"
                  key={index}
                  onClick={() => toggleSize(size)}
                  className={`px-3 py-1 border rounded ${
                    sizes.includes(size) ? "bg-black text-white" : ""
                  }`}
                >
                  {size}
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

        {/* ---------- Best Seller ---------- */}
        <div className="flex gap-2 items-center text-lg">
          <h2>Best Seller</h2>
          <input
            type="checkbox"
            checked={bestSeller}
            onChange={(e) => setBestSeller(e.target.checked)}
            className="h-4 w-4 border focus:outline-none"
          />
        </div>

        {/* ---------- Submit Button ---------- */}
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
