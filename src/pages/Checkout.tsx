// src/pages/Checkout.tsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CheckoutProvider, useCheckout } from "../context/CheckoutContext";
// import StepHeader from "../components/checkout/StepHeader";
import AddressStep from "../components/checkout/AddressStep";
import ScheduleStep from "../components/checkout/ScheduleStep";
import PatientsStep from "../components/checkout/PatientsStep";
import ReviewStep from "../components/checkout/ReviewStep";
import PatientModal from "../components/PatientModal";
import { customerApi } from "../api/axios";
import { toast } from "react-toastify";

const CheckoutInner: React.FC = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    selectedAddress,
    selectedDate,
    selectedSlot,
    assignedPatients,
    userId,
    setTotalPrice,
  } = useCheckout();

  const [activeStep, setActiveStep] = useState<number>(0);
  const [patientModalOpen, setPatientModalOpen] = useState(false);
  const [patientEditData, setPatientEditData] = useState<any | null>(null);
  const [patientModalForItem, setPatientModalForItem] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingCreated, setBookingCreated] = useState(false);
  const [bookingId, setBookingId] = useState<string>("");

  // used by child to open modal in create mode
  const openPatientModal = (item: any, editPatient?: any) => {
    setPatientModalForItem(item);
    setPatientEditData(editPatient ?? null);
    setPatientModalOpen(true);
  };

  const createBooking = async () => {
    // validate
    if (!selectedAddress) return toast.error("Please select a collection address.");
    if (!selectedDate) return toast.error("Please select a date.");
    if (!selectedSlot) return toast.error("Please select a time slot.");
    for (const it of cartItems) {
      const arr = assignedPatients[String(it.id)] ?? [];
      if (arr.length === 0) return toast.error(`Assign patient(s) for ${it.product_name || it.name}`);
    }

    setIsSubmitting(true);
    try {
      const itemsPayload: any[] = [];
      cartItems.forEach((it: any) => {
        (assignedPatients[String(it.id)] || []).forEach((p: any) => {
          itemsPayload.push({
            patient: p.id,
            base_price: parseFloat(it.base_price ?? it.price ?? 0),
            offer_price: parseFloat(it.offer_price ?? it.base_price ?? it.price ?? 0),
            product_type:
              it.product_type === "Profile"
                ? "lab_profile"
                : it.product_type === "Package"
                  ? "lab_package"
                  : "lab_test",
            product_id: it.product_id ?? it.product ?? it.id,
          });
        });
      });

      const base_total = itemsPayload.reduce((s, x) => s + (x.base_price || 0), 0);
      const offer_total = itemsPayload.reduce((s, x) => s + (x.offer_price || x.base_price || 0), 0);

      const payload: any = {
        user: userId,
        address: selectedAddress?.id,
        scheduled_date: selectedDate,
        scheduled_time_slot: selectedSlot,
        base_total,
        offer_total,
        final_amount: offer_total,
        items: itemsPayload,
      };

      const res: any = await customerApi.post("bookings/", payload);
      const created = res?.data ?? res;
      toast.success("Booking created successfully");
      try {
        await customerApi.post("carts/clear/");
      } catch (e) {
        try {
          const cr = await customerApi.get("carts/");
          const cart = cr?.data ?? cr;
          const obj = Array.isArray(cart) ? cart[0] : (cart?.results ? cart.results[0] : cart);
          if (obj?.id) {
            await customerApi.delete(`carts/${obj.id}/`);
          }
        } catch (ee) {
          // ignore
        }
      }
      setBookingCreated(true);
      setBookingId(created?.id ? String(created.id) : String(Date.now()).slice(-8));
      // optimistic clear handled elsewhere (server)
      setTotalPrice(0);
    } catch (err: any) {
      console.error("createBooking error", err);
      toast.error(err?.response?.data?.detail || "Failed to create booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  // derived totals preview
  const computedTotal = useMemo(() => {
    return cartItems.reduce((acc: number, it: any) => {
      const price = parseFloat(it.offer_price ?? it.base_price ?? it.price ?? 0);
      const assignedCount = (assignedPatients[String(it.id)] || []).length || 1;
      return acc + price * assignedCount;
    }, 0);
  }, [cartItems, assignedPatients]);

  // if booking done show success
  if (bookingCreated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Booking Created Successfully!</h1>
            <p className="text-gray-600 mb-8">Your booking ID is <span className="font-semibold text-blue-600">{bookingId}</span></p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => navigate("/")} className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700">Back to Home</button>
              <button onClick={() => navigate("/products")} className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg">Book More Tests</button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header  />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Checkout</h1>
          <p className="text-gray-600">Complete your booking details</p>
        </div>

        <div className="space-y-6">
          {activeStep === 0 && <AddressStep />}
          {activeStep === 1 && <ScheduleStep />}
          {activeStep === 2 && <PatientsStep openPatientModal={openPatientModal} />}
          {activeStep === 3 && <ReviewStep computedTotal={computedTotal} />}

          <div className="mt-4 flex justify-between">
            <div />
            <div className="flex gap-3">
              {activeStep > 0 && (
                <button onClick={() => setActiveStep((s) => s - 1)} className="px-4 py-2 border rounded">Back</button>
              )}
              {activeStep < 3 ? (
                <button
                  onClick={() => {
                    // basic validation per step
                    if (activeStep === 0) {
                      // address
                      if (!selectedAddress) {
                        toast.error("Please select an address");
                        return;
                      }
                      setActiveStep(1);
                    } else if (activeStep === 1) {
                      if (!selectedDate) { toast.error("Please select date"); return; }
                      if (!selectedSlot) { toast.error("Please select slot"); return; }
                      setActiveStep(2);
                    } else if (activeStep === 2) {
                      // ensure assignments exist
                      const missing = cartItems.find((it: any) => !(assignedPatients[String(it.id)]?.length > 0));
                      if (missing) { toast.error(`Assign patient(s) for ${missing.product_name || missing.name}`); return; }
                      setActiveStep(3);
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Continue
                </button>
              ) : (
                <button onClick={createBooking} disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded">
                  {isSubmitting ? "Creating..." : "Confirm Booking"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Patient modal used for both create and edit */}
        <PatientModal
          customerId={userId}
          open={patientModalOpen}
          onClose={() => {
            setPatientModalOpen(false);
            setPatientEditData(null);
            setPatientModalForItem(null);
          }}
          forItem={patientModalForItem}
          editingPatient={patientEditData}
          onSaved={() => {
            // refresh patients list in provider
            // provider has refreshPatients; easiest to reload page's patients via custom event or direct call
            // We'll call /client/patients/ to refresh context — simple approach:
            // TODO: ideally provider exposes refreshPatients; for now reload the window of patient list update event
            window.dispatchEvent(new Event("patients-updated"));
            setPatientModalOpen(false);
          }}
        />

      </main>
      <Footer />
    </div>
  );
};

const CheckoutPage: React.FC = () => (
  <CheckoutProvider>
    <CheckoutInner />
  </CheckoutProvider>
);

export default CheckoutPage;
