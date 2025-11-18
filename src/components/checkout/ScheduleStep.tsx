// src/components/checkout/ScheduleStep.tsx
import React from "react";
import StepHeader from "./StepHeader";
import { useCheckout } from "../../context/CheckoutContext";

const TIME_SLOTS = [
  "6:00 AM - 8:00 AM",
  "8:00 AM - 10:00 AM",
  "10:00 AM - 12:00 PM",
  "12:00 PM - 2:00 PM",
  "2:00 PM - 4:00 PM",
  "4:00 PM - 6:00 PM",
  "6:00 PM - 8:00 PM",
];

const ScheduleStep: React.FC = () => {
  const { selectedDate, setSelectedDate, selectedSlot, setSelectedSlot, selectedAddress } = useCheckout();

  return (
    <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <StepHeader title="Schedule" stepIndex={1} canChange={!!selectedDate || !!selectedSlot} onChange={() => { setSelectedDate(""); setSelectedSlot(""); }} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date *</label>
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} min={new Date().toISOString().split("T")[0]} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Time Slot *</label>
          <select value={selectedSlot} onChange={(e) => setSelectedSlot(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
            <option value="">Select slot</option>
            {TIME_SLOTS.map((s) => (<option key={s} value={s}>{s}</option>))}
          </select>
        </div>
      </div>
      {selectedAddress && <div className="mt-3 text-sm text-gray-600">Selected address: <strong>{selectedAddress.line1}</strong></div>}
    </section>
  );
};

export default ScheduleStep;
