import React from "react";
import { IndianRupee, Clock4, CreditCard, File, Link2 } from "lucide-react";
import { format } from "date-fns";

const statusColor = (status: string) => {
  switch (status) {
    case "success":
      return "bg-green-100 text-green-700 border-green-200";
    case "initiated":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "failed":
      return "bg-red-100 text-red-700 border-red-200";
    case "refunded":
      return "bg-purple-100 text-purple-700 border-purple-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const PaymentItem: React.FC<{ p: any }> = ({ p }) => {
  const bookingRef = p.booking_detail?.ref_id || p.booking;

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">

        {/* LEFT SIDE */}
        <div className="flex-1 min-w-0">
          {/* Amount */}
          <div className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <IndianRupee size={18} className="text-primary" />
            {p.amount}
          </div>

          {/* Status */}
          <div className="mt-1">
            <span
              className={`text-xs px-2 py-1 rounded-full border ${statusColor(
                p.status
              )}`}
            >
              {p.status.toUpperCase()}
            </span>
          </div>

          {/* Method */}
          <div className="mt-2 flex items-center gap-2 text-gray-600 text-sm">
            <CreditCard size={14} />
            {p.method || "—"}
          </div>

          {/* Booking Ref */}
          {bookingRef && (
            <div className="mt-1 text-sm text-gray-700">
              <span className="font-medium">Booking:</span> {bookingRef}
            </div>
          )}

          {/* Timestamp */}
          <div className="mt-1 flex items-center gap-2 text-gray-500 text-sm">
            <Clock4 size={14} />
            {p.created_at
              ? format(new Date(p.created_at), "dd MMM yyyy, hh:mm a")
              : "—"}
          </div>
        </div>

        {/* RIGHT SIDE BUTTONS */}
        <div className="flex flex-wrap sm:flex-col gap-2 sm:items-end">

          {/* Payment Link Button */}
          {p.payment_link && (
            <a
              href={p.payment_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 border rounded-lg text-primary hover:bg-gray-50 text-sm"
            >
              <Link2 size={16} className="text-primary" />
              Pay / View Link
            </a>
          )}

          {/* Receipt File */}
          {p.file_url && (
            <a
              href={p.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50 text-sm"
            >
              <File size={16} className="text-primary" />
              Receipt
            </a>
          )}

        </div>
      </div>
    </div>
  );
};

export default PaymentItem;
