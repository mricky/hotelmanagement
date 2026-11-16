import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const startIndex = totalItems > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0;
  const endIndex = Math.min(currentPage * rowsPerPage, totalItems);

  return (
    <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-slate-600 rounded-b-3xl">
      <div className="flex items-center gap-3">
        <span>Tampilkan</span>
        <select
          value={rowsPerPage}
          onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
          className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-[#EF3F09]"
        >
          <option value={5}>5 baris / hal</option>
          <option value={10}>10 baris / hal</option>
          <option value={25}>25 baris / hal</option>
          <option value={50}>50 baris / hal</option>
        </select>
        <span className="text-slate-500 font-semibold">
          {totalItems > 0 ? `Menampilkan ${startIndex}-${endIndex} dari ${totalItems} data` : '0 data'}
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition ${
            currentPage <= 1
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer'
          }`}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Sebelumnya</span>
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
              p === currentPage
                ? 'bg-[#EF3F09] text-white shadow-md'
                : 'bg-white border border-slate-200 hover:bg-slate-100 text-slate-700'
            }`}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition ${
            currentPage >= totalPages
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer'
          }`}
        >
          <span>Selanjutnya</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
