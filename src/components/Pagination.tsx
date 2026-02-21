import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const getVisiblePages = (): (number | "...")[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | "...")[] = [];

    // Always show first 3 pages
    pages.push(1, 2, 3);

    if (currentPage > 4) {
      pages.push("...");
    }

    // Show pages around current if mid-range
    if (currentPage > 3 && currentPage < totalPages - 2) {
      if (!pages.includes(currentPage - 1)) pages.push(currentPage - 1);
      if (!pages.includes(currentPage)) pages.push(currentPage);
      if (!pages.includes(currentPage + 1) && currentPage + 1 < totalPages - 1)
        pages.push(currentPage + 1);
    }

    if (currentPage < totalPages - 3) {
      if (!pages.includes("...")) pages.push("...");
    }

    // Always show last 2 pages
    if (!pages.includes(totalPages - 1)) pages.push(totalPages - 1);
    if (!pages.includes(totalPages)) pages.push(totalPages);

    return pages;
  };

  const pages = getVisiblePages();

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((page, idx) =>
        page === "..." ? (
          <span
            key={`dots-${idx}`}
            className="w-8 h-8 flex items-center justify-center text-text-secondary text-sm"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
              page === currentPage
                ? "bg-accent text-white"
                : "text-text-secondary hover:text-text-primary hover:bg-white/5"
            }`}
          >
            {page}
          </button>
        ),
      )}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
