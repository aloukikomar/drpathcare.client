import React from "react";
import StepHeader from "./StepHeader";
import { useCheckout } from "../../context/CheckoutContext";
import { TIME_SLOTS, isSlotExpired } from "../../utils/timeSlots";

const ScheduleStep: React.FC = () => {
  const {
    selectedDate,
    setSelectedDate,
    selectedSlot,
    setSelectedSlot,
    selectedAddress,
  } = useCheckout();

  const todayStr = new Date().toISOString().split("T")[0];

  const isToday = selectedDate === todayStr;

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(""); // reset slot when date changes
  };

  return (
    <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <StepHeader
        title="Schedule"
        stepIndex={1}
        canChange={!!selectedDate || !!selectedSlot}
        onChange={() => {
          setSelectedDate("");
          setSelectedSlot("");
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* DATE PICKER */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Date *
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
            min={todayStr}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* TIME SLOTS */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Slot *
          </label>
          <select
            value={selectedSlot}
            onChange={(e) => setSelectedSlot(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select slot</option>

            {TIME_SLOTS.map((slot) => {
              const expired = isToday ? isSlotExpired(slot) : false;

              return (
                <option key={slot} value={slot} disabled={expired}>
                  {slot} {expired ? "(Unavailable)" : ""}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {selectedAddress && (
        <div className="mt-3 text-sm text-gray-600">
          Selected address: <strong>{selectedAddress.line1}</strong>
        </div>
      )}
    </section>
  );
};

export default ScheduleStep;
