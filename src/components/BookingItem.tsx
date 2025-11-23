import { useState } from "react";
import {
  Calendar,
  MapPin,
  FileText,
  Pencil,
  IndianRupee,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

import EditBookingModal from "./EditBookingModal";
import PaymentListModal from "./PaymentListModal";
import DocumentListModal from "./DocumentListModal";

// same theme from older versions
const statusColor = (status) => {
  switch (status) {
    case "confirmed":
    case "payment_collected":
    case "completed":
      return "bg-green-100 text-green-700 border-green-200";
    case "verified":
    case "initiated":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "sample_collected":
      return "bg-orange-100 text-orange-700 border-orange-200";
    case "report_uploaded":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "failed":
    case "cancelled":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const BookingItem = ({ b }) => {
  const navigate = useNavigate();

  const [showEdit, setShowEdit] = useState(false);
  const [showPayments, setShowPayments] = useState(false);
  const [showDocs, setShowDocs] = useState(false);

  const status = (b.customer_status || "").toLowerCase();

  const address = [
    b.address_detail?.line1,
    b.address_detail?.line2,
    b.address_detail?.location?.city,
    b.address_detail?.location?.state,
    b.address_detail?.location?.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  const handleUpdateBooking = () => {
    window.location.reload()
  }

  return (
    <>
      {/* CARD */}
      <div className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">

          {/* LEFT */}
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900">
              Booking: {b.ref_id}
            </h4>

            {/* 🔥 RESTORED CUSTOMER STATUS CHIP */}
            <div className="mt-1">
              <span
                className={`text-xs px-2 py-1 rounded-full border ${statusColor(
                  status
                )}`}
              >
                {status.replace("_", " ").toUpperCase()}
              </span>
            </div>

            {/* DATE */}
            <div className="mt-2 flex items-center gap-1 text-sm text-gray-600">
              <Calendar size={14} />
              {b.scheduled_date
                ? format(new Date(b.scheduled_date), "dd MMM yyyy")
                : "—"}
              {b.scheduled_time_slot ? ` • ${b.scheduled_time_slot}` : ""}
            </div>

            {/* ADDRESS */}
            <div className="mt-1 flex items-start gap-1 text-sm text-gray-500">
              <MapPin size={14} />
              <span className="break-words">{address || "No address"}</span>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="sm:text-right flex flex-col gap-2 items-end">
            <div className="text-lg font-bold">₹{b.final_amount ?? "-"}</div>

            {/* ACTION BUTTONS */}
            <div className="grid grid-cols-4 sm:flex gap-2">

              {/* VIEW */}
              <button
                onClick={() => navigate(`/booking/${b.id}`)}
                className="
                  p-2 border rounded flex justify-center items-center bg-white
                  text-gray-700 border-gray-300
                  hover:text-primary hover:border-primary hover:bg-primary/5
                  transition
                "
              >
                <Eye size={16} />
              </button>

              {/* EDIT */}
              <button
                disabled={!["registered", "verified"].includes(b.customer_status?.toLowerCase())}
                onClick={() => setShowEdit(true)}
                className={`
    p-2 border rounded flex justify-center items-center transition

    ${["registered", "verified"].includes(b.customer_status?.toLowerCase())
                    ? "bg-white text-gray-700 border-gray-300 hover:text-primary hover:border-primary hover:bg-primary/5"
                    : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50"
                  }
  `}
              >
                <Pencil size={16} />
              </button>


              {/* PAYMENTS */}
              <button
                disabled={!b.payments?.length}
                onClick={() => setShowPayments(true)}
                className={`
                  p-2 border rounded flex justify-center items-center transition
                  ${b.payments?.length
                    ? "bg-white text-gray-700 border-gray-300 hover:text-primary hover:border-primary hover:bg-primary/5"
                    : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50"
                  }
                `}
              >
                <IndianRupee size={16} />
              </button>

              {/* DOCUMENTS */}
              <button
                disabled={!b.documents?.length}
                onClick={() => setShowDocs(true)}
                className={`
                  p-2 border rounded flex justify-center items-center transition
                  ${b.documents?.length
                    ? "bg-white text-gray-700 border-gray-300 hover:text-primary hover:border-primary hover:bg-primary/5"
                    : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50"
                  }
                `}
              >
                <FileText size={16} />
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <EditBookingModal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        booking={b}
        onUpdated={() => handleUpdateBooking()}
      />


      <PaymentListModal
        open={showPayments}
        onClose={() => setShowPayments(false)}
        payments={b.payments}
      />

      <DocumentListModal
        open={showDocs}
        onClose={() => setShowDocs(false)}
        documents={b.documents || []}
      />
    </>
  );
};

export default BookingItem;
