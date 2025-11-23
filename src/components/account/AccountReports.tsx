// src/components/account/AccountReports.tsx
import React from "react";
import { usePaginatedFetch } from "../../hooks/usePaginatedFetch";
import ReportItem from "../ReportItem";
import { Loader } from "lucide-react";

const AccountReports: React.FC = () => {
  const {
    items: documents,
    loading,
    error,
    page,
    count,
    setPage,
  } = usePaginatedFetch("client/booking-documents/", { page_size: 5 });

  return (
    <section className="bg-white rounded-lg p-5 shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Reports & Documents</h3>
        <span className="text-sm text-gray-500">Total: {count ?? "-"}</span>
      </div>

      {loading && (
        <div className="py-6 text-center text-gray-500">
          <Loader className="w-6 h-6 animate-spin mx-auto" />
        </div>
      )}

      {error && <div className="text-red-600 mb-3">{error}</div>}

      {!loading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc: any) => (
            <ReportItem key={doc.id} item={doc} />
          ))}
        </div>
      )}

      {!loading && documents.length === 0 && (
        <div className="py-4 text-center text-gray-500">No documents found.</div>
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
          onClick={() => setPage(page + 1)}
          disabled={documents.length === 0}
          className="px-3 py-1 border rounded text-sm disabled:opacity-40 hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default AccountReports;
