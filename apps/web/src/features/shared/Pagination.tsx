import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  itemName?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50],
  itemName = "registros",
}: PaginationProps) {
  const start = totalItems === 0 ? 0 : Math.max(1, (currentPage - 1) * pageSize + 1);
  const end = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between border-t border-[#e2edf8] px-5 py-4 text-sm text-[#53698d] gap-4">
      <span>
        Mostrando {start} a {end} de {totalItems} {itemName}
      </span>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {onPageSizeChange ? (
            <select
              className="rounded-md border border-slate-300 px-3 py-1.5 outline-none bg-white cursor-pointer shadow-sm hover:bg-slate-50 transition-colors text-slate-700 font-medium"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : (
            <button
              className="rounded-md border border-slate-300 px-3 py-1.5 bg-slate-50 cursor-default text-slate-700 font-medium"
              type="button"
              disabled
            >
              {pageSize}
            </button>
          )}
          <span className="text-slate-600">por página</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            className="rounded-md border border-slate-300 p-1.5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-slate-50 text-slate-500 hover:text-slate-700"
            disabled={currentPage === 1 || totalItems === 0}
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            type="button"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="px-3 py-1 font-medium text-[#056ba6]">
            {currentPage}
          </span>
          <button
            className="rounded-md border border-slate-300 p-1.5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-slate-50 text-slate-500 hover:text-slate-700"
            disabled={currentPage >= totalPages || totalItems === 0}
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            type="button"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
