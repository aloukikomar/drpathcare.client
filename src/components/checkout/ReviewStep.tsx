// src/components/checkout/ReviewStep.tsx
import React from "react";
import StepHeader from "./StepHeader";
import { useCheckout } from "../../context/CheckoutContext";
import AssignedPatientChip from "./AssignedPatientChip";

const ReviewStep: React.FC<{ computedTotal: number }> = ({ computedTotal }) => {
  const { cartItems, assignedPatients, selectedAddress, selectedDate, selectedSlot } = useCheckout();

  return (
    <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <StepHeader title="Review & Create Booking" stepIndex={3} canChange={false} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="border rounded p-4">
            <h3 className="font-semibold mb-2">Schedule</h3>
            <div className="text-sm text-gray-700">Date: <span className="font-medium">{selectedDate}</span></div>
            <div className="text-sm text-gray-700">Time: <span className="font-medium">{selectedSlot}</span></div>
            <div className="text-sm text-gray-700 mt-2">Address: <span className="font-medium">{selectedAddress?.line1}{selectedAddress?.line2 ? `, ${selectedAddress.line2}` : ""}</span></div>
          </div>

          <div className="border rounded p-4 space-y-3">
            <h3 className="font-semibold">Items & Patients</h3>
            {cartItems.map((it: any) => (
              <div key={it.id} className="p-3 border rounded">
                <div className="flex justify-between">
                  <div>
                    <div className="font-medium">{it.product_name || it.name}</div>
                    <div className="text-sm text-gray-600">{it.product_type}</div>
                  </div>
                  <div className="text-sm font-semibold">₹{it.offer_price ?? it.base_price ?? it.price}</div>
                </div>

                <div className="mt-2">
                  <div className="text-sm text-gray-600 mb-2">Assigned Patients:</div>
                  <div className="flex flex-wrap gap-2">
                    {(assignedPatients[String(it.id)] || []).map((p: any) => (
                      <AssignedPatientChip patient={p} readonly />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4">
              {cartItems.map((it: any) => (
                <div key={it.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">{it.product_name || it.name}</span>
                  <span className="text-gray-900">₹{(it.offer_price ?? it.base_price ?? it.price) * ((assignedPatients[String(it.id)] || []).length || 1)}</span>
                </div>
              ))}
              <hr className="border-gray-200" />
              <div className="flex justify-between text-gray-600">
                <span>Home Collection</span>
                <span className="text-green-600">Free</span>
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between text-lg font-semibold text-gray-900">
                <span>Total</span>
                <span>₹{computedTotal}</span>
              </div>
            </div>
            <div className="text-xs text-gray-500">By confirming you agree to our terms and booking policies.</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewStep;
