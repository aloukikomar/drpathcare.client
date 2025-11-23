import { X } from "lucide-react";
import PaymentItem from "./PaymentItem";

// Minimal type so TS stops complaining
type Payment = {
  id: string | number;
  [key: string]: any;
};

interface Props {
  open: boolean;
  payments?: Payment[];
  onClose: () => void;
}

export default function PaymentListModal({ open, payments = [], onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-[200] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-5 max-h-[85vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Payments</h2>
          <button onClick={onClose} className="hover:text-primary transition">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Empty State */}
        {payments.length === 0 ? (
          <div className="py-6 text-center text-sm text-gray-500">
            No payments found for this booking.
          </div>
        ) : (
          payments.map((p: Payment) => (
            <div key={p.id} className="mb-3">
              <PaymentItem p={p} />
            </div>
          ))
        )}

      </div>
    </div>
  );
}
