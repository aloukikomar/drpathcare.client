// src/components/booking/EditBookingModal.tsx

import { useState } from "react";
import { X, Calendar, Clock, Trash2, RefreshCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { customerApi } from "../api/axios";
import { useToast } from "../context/ToastManager";

const TIME_SLOTS = [
  "6:00 AM - 8:00 AM",
  "8:00 AM - 10:00 AM",
  "10:00 AM - 12:00 PM",
  "12:00 PM - 2:00 PM",
  "2:00 PM - 4:00 PM",
  "4:00 PM - 6:00 PM",
  "6:00 PM - 8:00 PM",
];

const EditBookingModal = ({
  open,
  onClose,
  booking,
  onUpdated,
}) => {
  const [newDate, setNewDate] = useState("");
  const [newSlot, setNewSlot] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  if (!open) return null;

  const canReschedule = newDate && newSlot && notes.trim().length > 0;
  const canCancel = notes.trim().length > 0;

  // -------------------------------------------------
  // API: RESCHEDULE BOOKING
  // -------------------------------------------------
  const handleReschedule = async () => {
    if (!canReschedule) return;

    setLoading(true);
    try {
      await customerApi.patch(`client/bookings/${booking.id}/`, {
        action: "reschedule",
        scheduled_date: newDate,
        scheduled_time_slot: newSlot,
        remarks: notes,
      });

      showToast("Booking rescheduled!", "success");
      onClose();
      onUpdated?.();
    } catch (err) {
      console.error(err);
      showToast("Failed to reschedule booking", "error");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------
  // API: CANCEL BOOKING
  // -------------------------------------------------
  const handleCancel = async () => {
    if (!canCancel) return;

    setLoading(true);
    try {
      await customerApi.patch(`client/bookings/${booking.id}/`, {
        action: "cancel",
        remarks: notes,
      });
      showToast("Booking cancelled", "error");
      onClose();
      onUpdated?.();
    } catch (err) {
      console.error(err);
      showToast("Failed to cancel booking", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-xl w-full max-w-md p-5"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          {/* HEADER */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Edit Booking</h2>
            <button onClick={onClose}>
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* BOOKING REF */}
          <div className="text-sm text-gray-600 mb-4">
            Booking ID:{" "}
            <span className="font-medium text-gray-900">
              {booking?.ref_id}
            </span>
          </div>

          {/* DATE */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-800 flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-primary" />
              Select New Date
            </label>

            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full border rounded-lg p-2 text-sm"
            />
          </div>

          {/* TIME SLOT SELECTOR */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-800 flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-primary" />
              Select Time Slot
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TIME_SLOTS.map((slot) => {
                const active = newSlot === slot;
                return (
                  <button
                    key={slot}
                    onClick={() => setNewSlot(slot)}
                    className={`
                      text-sm p-2 rounded-lg border transition
                      ${
                        active
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-primary/5 hover:border-primary hover:text-primary"
                      }
                    `}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          {/* NOTES */}
          <div>
            <label className="text-sm font-medium text-gray-800 flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-primary" />
              Remarks (required for reschedule or cancellation)
            </label>

            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border rounded-lg p-2 text-sm resize-none"
              placeholder="Enter remarks…"
            />
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">

            {/* RESCHEDULE */}
            <button
              disabled={!canReschedule || loading}
              onClick={handleReschedule}
              className={`
                flex-1 flex items-center justify-center gap-2 p-2 rounded-lg text-white font-medium transition
                ${
                  canReschedule
                    ? "bg-primary hover:bg-gradient-to-r hover:from-primary hover:to-secondary"
                    : "bg-gray-300 cursor-not-allowed"
                }
              `}
            >
              <RefreshCcw size={16} />
              {loading ? "Updating..." : "Reschedule"}
            </button>

            {/* CANCEL */}
            <button
              disabled={!canCancel || loading}
              onClick={handleCancel}
              className={`
                flex-1 flex items-center justify-center gap-2 p-2 rounded-lg border text-red-600 transition
                ${
                  canCancel
                    ? "border-red-300 hover:bg-red-50"
                    : "border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed"
                }
              `}
            >
              <Trash2 size={16} />
              {loading ? "Updating..." : "Cancel"}
            </button>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditBookingModal;
