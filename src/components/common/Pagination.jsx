export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-1.5 py-4">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 disabled:opacity-40 hover:bg-gray-50"
      >
        Prev
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`h-8 w-8 rounded-lg text-sm font-medium ${
            p === currentPage ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 disabled:opacity-40 hover:bg-gray-50"
      >
        Next
      </button>
    </div>
  );
}
