import React from "react";
import { FileText, Calendar, User, Download } from "lucide-react";
import { format } from "date-fns";

const badgeColor = (type: string) => {
  if (!type) return "bg-gray-100 text-gray-700 border-gray-200";
  const t = type.toLowerCase();

  if (t.includes("report")) return "bg-blue-100 text-blue-700 border-blue-200";
  if (t.includes("receipt")) return "bg-green-100 text-green-700 border-green-200";
  return "bg-gray-100 text-gray-700 border-gray-200";
};

const ReportItem: React.FC<{ item: any }> = ({ item }) => {
  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition">
      <div className="flex gap-3 items-start">
        {/* Left Icon */}
        <div className="shrink-0">
          <FileText className="text-primary w-7 h-7" />
        </div>

        {/* Right Data */}
        <div className="flex-1 min-w-0">
          {/* Title + Download Button */}
          <div className="flex items-start justify-between gap-3">
            <h4 className="font-semibold text-gray-900 text-base truncate flex-1">
              {item.name}
            </h4>

            <a
              href={item.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg border hover:bg-gray-100 shrink-0"
              title="Download"
            >
              <Download size={18} className="text-primary" />
            </a>
          </div>

          {/* Type Badge */}
          {item.doc_type && (
            <span
              className={`mt-2 inline-block text-xs px-2 py-1 rounded-full border ${badgeColor(
                item.doc_type
              )}`}
            >
              {item.doc_type.replace("_", " ").toUpperCase()}
            </span>
          )}

          {/* Booking */}
          <div className="mt-2 text-sm text-gray-700">
            <strong>Booking :</strong> {item.booking_code}
          </div>

          {/* Desc */}
          {item.description && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              Description : {item.description}
            </p>
          )}

          {/* Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              {item.created_at
                ? format(new Date(item.created_at), "dd MMM yyyy, HH:mm")
                : "—"}
            </div>

            <div className="flex items-center gap-1">
              <User size={14} />
              {item.uploaded_by_name || "System"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportItem;
