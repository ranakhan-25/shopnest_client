// components/ProductPagination.tsx
import { PaginationData } from "@/types/product";

interface PaginationProps {
  pagination: PaginationData;
  setPage: (page: number | ((prev: number) => number)) => void;
}

export default function ProductPagination({ pagination, setPage }: PaginationProps) {
  const { currentPage, totalPages, hasNextPage, hasPreviousPage } = pagination;

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-4 mt-8">
      {/* Previous Button */}
      <button
        onClick={() => setPage((prev) => prev - 1)}
        disabled={!hasPreviousPage}
        className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
      >
        Previous
      </button>

      {/* Current Page Info */}
      <span className="text-gray-700 dark:text-gray-300 font-medium">
        Page {currentPage} of {totalPages}
      </span>

      {/* Next Button */}
      <button
        onClick={() => setPage((prev) => prev + 1)}
        disabled={!hasNextPage}
        className="px-4 py-2 bg-black/90 dark:bg-white/90 text-white dark:text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black dark:hover:bg-white transition-colors"
      >
        Next
      </button>
    </div>
  );
}