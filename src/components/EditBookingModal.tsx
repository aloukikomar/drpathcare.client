// src/components/booking/EditBookingModal.tsx
import { useEffect, useState } from "react";
import { X, Calendar, Clock, Trash2, RefreshCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { customerApi } from "../api/axios";
import { useToast } from "../context/ToastManager";
import { TIME_SLOTS } from "../utils/timeSlots"; // <-- shared timeslots

interface Props {
  open: boolean;
  onClose: () => void;
  booking: any;
  onUpdated?: () => void;
}

const parseSlotTimes = (slotLabel: string) => {
  // Example slotLabel: "5:00 AM - 6:00 AM" or "12:00 PM - 1:00 PM"
  const [startStr, endStr] = slotLabel.split(" - ").map((s) => s.trim());
  return { startStr, endStr };
};

const toDateTime = (dateStr: string, timeStr: string) => {
  // dateStr in YYYY-MM-DD, timeStr like "5:00 AM"
  const [time, meridiem] = timeStr.split(" ");
  const [hourS, minS] = time.split(":");
  let hour = parseInt(hourS, 10);
  const minute = parseInt(minS, 10);
  if (meridiem.toUpperCase() === "PM" && hour !== 12) hour += 12;
  if (meridiem.toUpperCase() === "AM" && hour === 12) hour = 0;
  const d = new Date(dateStr + "T00:00:00");
  d.setHours(hour, minute, 0, 0);
  return d;
};

const isSlotInPast = (slotLabel: string, selectedDate: string) => {
  if (!selectedDate) return false;
  try {
    const { endStr } = parseSlotTimes(slotLabel);
    const slotEnd = toDateTime(selectedDate, endStr);
    const now = new Date();
    return slotEnd <= now;
  } catch {
    return false;
  }
};

const EditBookingModal: React.FC<Props> = ({ open, onClose, booking, onUpdated }) => {
  const [newDate, setNewDate] = useState<string>("");
  const [newSlot, setNewSlot] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    // prefill with booking's current schedule (if available)
    if (open) {
      setNewDate(booking?.scheduled_date ?? "");
      setNewSlot(booking?.scheduled_time_slot ?? "");
      setNotes("");
    }
  }, [open, booking]);

  // reset selected slot when date changes (so user re-picks if same slot becomes invalid)
  useEffect(() => {
    setNewSlot(""); // force reselect when date changes
  }, [newDate]);

  const canReschedule = Boolean(newDate && newSlot && notes.trim().length > 0);
  const canCancel = Boolean(notes.trim().length > 0);

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

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed !mt-0 inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Edit booking"
          className="bg-white rounded-2xl shadow-xl w-full max-w-md p-5"
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
        >
          {/* HEADER */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Edit Booking</h2>
            <button onClick={onClose} aria-label="Close">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* REF */}
          <div className="text-sm text-gray-600 mb-4">
            Booking ID:{" "}
            <span className="font-medium text-gray-900">{booking?.ref_id}</span>
          </div>

          {/* NEW DATE */}
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
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          {/* SLOTS */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-800 flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-primary" />
              Select Time Slot
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TIME_SLOTS.map((slot) => {
                const disabled = !!newDate && isSlotInPast(slot, newDate);
                const active = newSlot === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => !disabled && setNewSlot(slot)}
                    disabled={disabled}
                    className={`text-sm p-2 rounded-lg border transition focus:outline-none
                      ${active
                        ? "bg-primary text-white border-primary"
                        : disabled
                        ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-primary/5 hover:border-primary hover:text-primary"
                      }`}
                    aria-pressed={active}
                    aria-disabled={disabled}
                    title={disabled ? "This slot is no longer available" : slot}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>

            {newDate && (
              <p className="text-xs text-gray-500 mt-2">
                {new Date(newDate).toLocaleDateString(undefined, {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
                {" — pick a slot above"}
              </p>
            )}
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
            <button
              disabled={!canReschedule || loading}
              onClick={handleReschedule}
              className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg text-white font-medium transition
                ${canReschedule
                  ? "bg-primary hover:bg-gradient-to-r hover:from-primary hover:to-secondary"
                  : "bg-gray-300 cursor-not-allowed"
                }`}
            >
              <RefreshCcw size={16} />
              {loading ? "Updating..." : "Reschedule"}
            </button>

            <button
              disabled={!canCancel || loading}
              onClick={handleCancel}
              className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg border text-red-600 transition
                ${canCancel
                  ? "border-red-300 hover:bg-red-50"
                  : "border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed"
                }`}
            >
              <Trash2 size={16} />
              {loading ? "Updating..." : "Cancel Booking"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditBookingModal;
