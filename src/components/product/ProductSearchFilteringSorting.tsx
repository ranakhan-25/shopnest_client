
interface FilterProps {
  search: string;
  setSearch: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  sort: string;
  setSort: (value: string) => void;
  setPage: (value: number) => void;
}

export default function ProductSearchFilteringSorting({
  search,
  setSearch,
  category,
  setCategory,
  sort,
  setSort,
  setPage,
}: FilterProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6 transition-colors">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search products by name..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1); // সার্চ পরিবর্তন করলে প্রথম পেজে রিডাইরেক্ট হবে
        }}
        className="w-full md:w-1/3 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex gap-4 w-full md:w-auto">
        {/* Category Filter */}
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="w-1/2 md:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">All Categories</option>
          <option value="Watches">Watches</option>
          <option value="Bags">Bags</option>
          <option value="Laptops">Laptops</option>
          <option value="Cameras">Cameras</option>
          <option value="Fashion">Fashion</option>
          <option value="Shoes">Shoes</option>
          <option value="Accessories">Accessories</option>
          <option value="Electronics">Electronics</option>
        </select>

        {/* Sorting */}
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(1);
          }}
          className="w-1/2 md:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">Sort By</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
}