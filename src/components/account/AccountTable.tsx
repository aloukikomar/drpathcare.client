// src/components/account/AccountTable.tsx
import React from "react";
import { Loader, Plus } from "lucide-react";

interface AccountTableProps {
  title: string;
  items: any[];
  loading: boolean;
  error: string | null;
  page: number;
  next: string | null;
  setPage: (page: number) => void;
  count: number | null;

  showAddButton?: boolean;
  onAdd?: () => void;

  renderItem: (item: any) => React.ReactNode;
}

const AccountTable: React.FC<AccountTableProps> = ({
  title,
  items,
  loading,
  error,
  page,
  next,
  setPage,
  count,
  showAddButton = false,
  onAdd,
  renderItem,
}) => {
  return (
    <section className="bg-white rounded-lg p-5 shadow-sm border">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">{title}</h3>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">Total: {count ?? "-"}</span>

          {showAddButton && (
            <button
              onClick={onAdd}
              className="
    flex items-center gap-1 px-3 py-1 rounded text-white font-medium
    bg-primary
    transition-all
    hover:bg-gradient-to-r hover:from-primary hover:to-secondary
    hover:shadow-sm
    active:scale-[.98]
  "
            >
              <Plus size={16} /> Add
            </button>

          )}
        </div>
      </div>

      {/* Loaders */}
      {loading && (
        <div className="py-6 text-center text-gray-500">
          <Loader className="w-6 h-6 animate-spin mx-auto" />
        </div>
      )}

      {error && <div className="text-red-600 mb-3">{error}</div>}

      {/* Items */}
      {!loading && items.length > 0 && (
        <div className="space-y-4">{items.map(renderItem)}</div>
      )}

      {!loading && items.length === 0 && (
        <div className="py-4 text-center text-gray-500">No items found.</div>
      )}

      {/* Pagination */}
      <div className="mt-5 flex items-center justify-between">
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="px-3 py-1 border rounded text-sm disabled:opacity-40 hover:bg-gray-50"
        >
          Prev
        </button>

        <div className="text-sm text-gray-600">Page {page}</div>

        <button
          onClick={() => next && setPage(page + 1)}
          disabled={!next}
          className="px-3 py-1 border rounded text-sm disabled:opacity-40 hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default AccountTable;
