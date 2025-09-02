import { useContext, useEffect, useState, useCallback, useMemo } from "react";
import { ShopContext } from "../contexts/ShopContextsProvider";
import { IoIosArrowForward, IoIosClose } from "react-icons/io";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  // Context and state management
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");
  const [error, setError] = useState(null);

  // Toggle handlers for category filters
  const toggleCategory = useCallback((e) => {
    const value = e.target.value;
    setCategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  }, []);

  const toggleSubCategory = useCallback((e) => {
    const value = e.target.value;
    setSubCategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  }, []);

  // Memoized filter function
  const memoizedApplyFilter = useCallback(() => {
    try {
      let productsCopy = [...products];

      //Apply seacrh filter

      if (showSearch && search) {
        productsCopy = productsCopy.filter((i) =>
          i.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Apply category filter
      if (category.length > 0) {
        productsCopy = productsCopy.filter((item) =>
          category.includes(item.category)
        );
      }

      // Apply subcategory filter
      if (subCategory.length > 0) {
        productsCopy = productsCopy.filter((item) =>
          subCategory.includes(item.subCategory)
        );
      }

      // Apply sorting
      switch (sortType) {
        case "low-to-high":
          productsCopy.sort((a, b) => a.price - b.price);
          break;
        case "high-to-low":
          productsCopy.sort((a, b) => b.price - a.price);
          break;
        default:
          // Keep original order for "relevant"
          break;
      }

      setFilteredProducts(productsCopy);
      setError(null);
    } catch (err) {
      setError("Failed to filter products");
      console.error(err);
    }
  }, [products, category, subCategory, sortType, search, showSearch]);

  // Effect hooks for filtering and initial load
  useEffect(() => {
    memoizedApplyFilter();
  }, [memoizedApplyFilter]);

  // Memoized product list
  const memoizedFilteredProducts = useMemo(() => {
    return filteredProducts.map((item) => (
      <ProductItem
        key={item._id}
        name={item.name}
        id={item._id}
        image={item.image[0].url}
        price={item.price}
      />
    ));
  }, [filteredProducts]);

  // Categories and SubCategories data
  const categories = ["Men", "Women", "Kids"];
  const subCategories = ["Topwear", "Bottomwear", "Winter"];

  // Filter component for both mobile and desktop
  const FilterSection = ({ isMobile = false }) => (
    <div className={isMobile ? "p-4 space-y-6" : "space-y-6"}>
      {/* Category filter */}
      <div className="border border-gray-300 p-4">
        <p className="uppercase font-medium mb-3">Categories</p>
        <div className="flex flex-col text-gray-700 text-sm font-light space-y-2">
          {categories.map((item) => (
            <label key={item} className="flex gap-2 cursor-pointer">
              <input
                className="w-3"
                type="checkbox"
                value={item}
                checked={category.includes(item)}
                onChange={toggleCategory}
                aria-label={`Filter by ${item} category`}
              />
              {item}
            </label>
          ))}
        </div>
      </div>

      {/* Sub-Category filter */}
      <div className="border border-gray-300 p-4">
        <p className="uppercase font-medium mb-3">Sub Category</p>
        <div className="flex flex-col text-gray-700 text-sm font-light space-y-2">
          {subCategories.map((item) => (
            <label key={item} className="flex gap-2 cursor-pointer">
              <input
                className="w-3"
                type="checkbox"
                value={item}
                checked={subCategory.includes(item)}
                onChange={toggleSubCategory}
                aria-label={`Filter by ${item} subcategory`}
              />
              {item}
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="pageW my-10">
      {error && (
        <div className="text-red-500 mb-4 p-4 bg-red-50 rounded">{error}</div>
      )}

      <div className="flex flex-col lg:flex-row lg:gap-4 sm:gap-0">
        {/* Filter section */}
        <div className="lg:w-60">
          {/* Mobile filter trigger */}
          <p
            onClick={() => setShowFilter(true)}
            className="lg:hidden my-2 text-xl flex items-center cursor-pointer gap-2 uppercase"
          >
            Filters
            <IoIosArrowForward className={showFilter ? "hidden" : "block"} />
          </p>

          {/* Desktop filter */}
          <div className="hidden lg:block">
            <FilterSection />
          </div>

          {/* Mobile filter slide-in */}
          <div
            className={`fixed inset-0 z-50 bg-black/50 transition-opacity lg:hidden ${
              showFilter
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setShowFilter(false)}
          >
            <div
              className={`absolute left-0 top-0 h-full w-[70%] max-w-xs bg-white shadow-lg transform transition-transform duration-300 ${
                showFilter ? "translate-x-0" : "-translate-x-full"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-medium">Filters</h2>
                <button
                  onClick={() => setShowFilter(false)}
                  className="text-2xl hover:text-gray-700"
                  aria-label="Close filters"
                >
                  <IoIosClose />
                </button>
              </div>
              <FilterSection isMobile />
            </div>
          </div>
        </div>

        {/* Products section */}
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div className="lg:text-2xl sm:text-xl h-auto">
              <Title text1="ALL" text2="COLLECTION" />
            </div>

            {/* Sort dropdown */}
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              className="border-2 border-gray-300 px-2 py-2 text-sm"
              aria-label="Sort products"
            >
              <option value="relevant">Sort by: Relevant</option>
              <option value="low-to-high">Sort by: Low to High</option>
              <option value="high-to-low">Sort by: High to Low</option>
            </select>
          </div>

          {/* Products grid */}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {memoizedFilteredProducts}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;
