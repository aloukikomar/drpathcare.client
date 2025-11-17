// src/pages/Checkout.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Plus,
  X,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AddressSection from "../components/address/AddressSection";
import { customerApi } from "../api/axios";
import { toast } from "react-toastify";
import type { Address } from "../components/address/AddressCard";

type AnyObj = Record<string, any>;
type ApiAddress = Address;
type ApiPatient = AnyObj;
type CartItemApi = AnyObj;

const TIME_SLOTS = [
  "6:00 AM - 8:00 AM",
  "8:00 AM - 10:00 AM",
  "10:00 AM - 12:00 PM",
  "12:00 PM - 2:00 PM",
  "2:00 PM - 4:00 PM",
  "4:00 PM - 6:00 PM",
  "6:00 PM - 8:00 PM",
];

const extractList = (res: any) => {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (res.results && Array.isArray(res.results)) return res.results;
  if (res.data && Array.isArray(res.data)) return res.data;
  if (res.data && res.data.results && Array.isArray(res.data.results)) return res.data.results;
  if (res.data && typeof res.data === "object" && !Array.isArray(res.data)) return [res.data];
  if (res && typeof res === "object" && Object.keys(res).length && !Array.isArray(res)) return [res];
  return [];
};

const Checkout: React.FC = () => {
  const navigate = useNavigate();

  const [, setCartObj] = useState<any | null>(null);
  const [cartItems, setCartItems] = useState<CartItemApi[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  // Wizard step: 0 = Address, 1 = Schedule, 2 = Patients, 3 = Review
  const [activeStep, setActiveStep] = useState<number>(0);

  const [selectedAddress, setSelectedAddress] = useState<ApiAddress | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");

  // assigned patients map: itemId -> array of patients
  const [assignedPatients, setAssignedPatients] = useState<Record<string, ApiPatient[]>>({});

  const [patientsList, setPatientsList] = useState<ApiPatient[]>([]);
  const [, setLoadingPatients] = useState(false);

  // patient modal
  const [patientModalOpen, setPatientModalOpen] = useState(false);
  const [patientModalForItem, setPatientModalForItem] = useState<CartItemApi | null>(null);

  const [newPatient, setNewPatient] = useState({
    first_name: "",
    last_name: "",
    mobile: "",
    email: "",
    gender: "",
    date_of_birth: "",
    age: "",
  });
  const [creatingPatient, setCreatingPatient] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingCreated, setBookingCreated] = useState(false);
  const [bookingId, setBookingId] = useState<string>("");

  const localUser = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "null") : null;
  const userId = localUser?.id || null;

  // -------------------------
  // Fetch cart
  // -------------------------
  const fetchCart = async () => {
    try {
      const res = await customerApi.get("carts/");
      const data = res?.data ?? res;
      let cart;
      if (Array.isArray(data)) {
        cart = data[0] ?? null;
      } else if (data && Array.isArray(data.results)) {
        cart = data.results[0] ?? null;
      } else if (data && (data.items || data.id)) {
        cart = data;
      } else if (res && Array.isArray(res.results)) {
        cart = res.results[0] ?? null;
      } else {
        cart = data || res;
      }

      setCartObj(cart);
      const items = cart?.items ?? [];
      setCartItems(items);

      // init assigned map
      const map: Record<string, ApiPatient[]> = {};
      items.forEach((it: any) => (map[it.id] = []));
      setAssignedPatients(map);

      const tp = parseFloat(cart?.total_price || "0") || items.reduce((s: number, it: any) => {
        const price = parseFloat(it.offer_price ?? it.base_price ?? it.price ?? 0);
        const qty = it.quantity ?? 1;
        return s + price * qty;
      }, 0);
      setTotalPrice(tp);
    } catch (err) {
      console.error("fetchCart error", err);
      toast.error("Unable to load cart");
    }
  };

  // -------------------------
  // Fetch patients
  // -------------------------
  const fetchPatients = async () => {
    setLoadingPatients(true);
    try {
      const res = await customerApi.get("client/patients/");
      const list = res?.results ?? res?.data?.results ?? res?.data ?? res;
      const arr = Array.isArray(list) ? list : extractList(list);
      setPatientsList(arr);
    } catch (err) {
      console.error("fetchPatients", err);
    } finally {
      setLoadingPatients(false);
    }
  };

  useEffect(() => {
    fetchCart();
    fetchPatients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------
  // Helpers
  // -------------------------


  const openPatientModalForItem = (item: CartItemApi) => {
    setPatientModalForItem(item);
    setPatientModalOpen(true);
  };

  const assignExistingPatientToItem = (itemId: string | number, patientId: number) => {
    const patient = patientsList.find((p) => p.id === patientId);
    if (!patient) {
      toast.error("Patient not found");
      return;
    }
    setAssignedPatients((prev) => {
      const copy = { ...prev };
      const id = String(itemId);
      const arr = copy[id] ? [...copy[id]] : [];
      if (arr.some((p) => p.id === patient.id)) {
        toast.info("Patient already assigned");
        return prev;
      }
      arr.push(patient);
      copy[id] = arr;
      return copy;
    });
  };

  const removeAssignedPatient = (itemId: string | number, patientId: number) => {
    setAssignedPatients((prev) => {
      const copy = { ...prev };
      const id = String(itemId);
      copy[id] = (copy[id] || []).filter((p) => p.id !== patientId);
      return copy;
    });
  };

  const createPatientAndAssign = async (itemId: string | number) => {
    if (!newPatient.first_name || !newPatient.mobile) {
      toast.error("Please provide patient name and mobile");
      return;
    }

    setCreatingPatient(true);
    try {
      const payload: AnyObj = {
        first_name: newPatient.first_name,
        last_name: newPatient.last_name || "",
        mobile: newPatient.mobile,
        email: newPatient.email || "",
        gender: newPatient.gender || "",
        date_of_birth: newPatient.date_of_birth || null,
        age: newPatient.age ? Number(newPatient.age) : null,
      };

      const res = await customerApi.post("client/patients/", payload);
      const created = res?.data ?? res;
      setPatientsList((prev) => [created, ...prev]);
      setAssignedPatients((prev) => {
        const copy = { ...prev };
        const id = String(itemId);
        const arr = copy[id] ? [...copy[id]] : [];
        arr.push(created);
        copy[id] = arr;
        return copy;
      });

      toast.success("Patient created & assigned");
      setPatientModalOpen(false);
      setNewPatient({
        first_name: "",
        last_name: "",
        mobile: "",
        email: "",
        gender: "",
        date_of_birth: "",
        age: "",
      });
    } catch (err) {
      console.error("createPatientAndAssign", err);
      toast.error("Unable to create patient");
    } finally {
      setCreatingPatient(false);
    }
  };

  const validateStep = (step: number): string | null => {
    if (step === 0) {
      if (!selectedAddress) return "Please select a collection address.";
    }
    if (step === 1) {
      if (!selectedDate) return "Please select preferred date.";
      if (!selectedSlot) return "Please select a preferred time slot.";
    }
    if (step === 2) {
      for (const it of cartItems) {
        const arr = assignedPatients[String(it.id)] || [];
        if (arr.length === 0) return `Please assign patient(s) for "${it.product_name || it.name || "an item"}".`;
      }
    }
    return null;
  };

  const getProductType = (p_type: string) => {
    if (p_type === "Profile") return "lab_profile";
    if (p_type === "Package") return "lab_package";
    return "lab_test";
  };

  const createBooking = async () => {
    const errMsg = validateStep(2);
    if (errMsg) {
      toast.error(errMsg);
      return;
    }
    setIsSubmitting(true);
    try {
      const itemsPayload: AnyObj[] = [];
      cartItems.forEach((it: any) => {
        const assigned = assignedPatients[String(it.id)] || [];
        assigned.forEach((p: any) => {
          itemsPayload.push({
            patient: p.id,
            base_price: parseFloat(it.base_price ?? it.price ?? 0),
            offer_price: parseFloat(it.offer_price ?? it.base_price ?? it.price ?? 0),
            product_type: getProductType(it.product_type ?? it.type),
            product_id: it.product_id ?? it.product ?? it.id,
          });
        });
      });

      const base_total = itemsPayload.reduce((s, x) => s + (x.base_price || 0), 0);
      const offer_total = itemsPayload.reduce((s, x) => s + (x.offer_price || x.base_price || 0), 0);

      const payload: AnyObj = {
        user: userId,
        address: selectedAddress?.id,
        scheduled_date: selectedDate,
        scheduled_time_slot: selectedSlot,
        remarks: "",
        base_total,
        offer_total,
        final_amount: offer_total,
        items: itemsPayload,
      };

      const res = await customerApi.post("bookings/", payload);
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
    } catch (err: any) {
      console.error("createBooking error", err);
      toast.error(err?.response?.data?.detail || "Failed to create booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  // totals
  const computedTotal = useMemo(() => {
    return cartItems.reduce((acc: number, it: any) => {
      const price = parseFloat(it.offer_price ?? it.base_price ?? it.price ?? 0);
      const assignedCount = (assignedPatients[String(it.id)] || []).length || 1;
      return acc + price * assignedCount;
    }, 0);
  }, [cartItems, assignedPatients]);

  useEffect(() => setTotalPrice((prev) => (computedTotal !== prev ? computedTotal : prev)), [computedTotal]);

  const isCartEmpty = cartItems.length === 0;

  // -------------------------
  // UI: Step header helper
  // -------------------------
  const StepHeader: React.FC<{ title: string; stepIndex: number }> = ({ title, stepIndex }) => {
    return (
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-sm font-semibold">{`Step ${stepIndex + 1}`}</div>
          <div className="text-lg font-semibold">{title}</div>
        </div>

        <div>
          {activeStep > 0 && (
            <button
              className="px-3 py-1 border rounded text-sm"
              onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
            >
              Change
            </button>
          )}
        </div>
      </div>
    );
  };

  // -------------------------
  // Render
  // -------------------------
  if (isCartEmpty && !bookingCreated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header showSearch />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">No items to checkout</h1>
            <p className="text-gray-600 mb-8">Add some tests to your cart first.</p>
            <button
              onClick={() => navigate("/products")}
              className="inline-flex items-center bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Browse Tests
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (bookingCreated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header showSearch />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Booking Created Successfully!</h1>
            <p className="text-gray-600 mb-8">Your booking ID is <span className="font-semibold text-blue-600">{bookingId}</span></p>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 max-w-md mx-auto">
              <h2 className="font-semibold text-lg text-gray-900 mb-4">What's Next?</h2>
              <ul className="text-left text-gray-600 space-y-2">
                <li>• Our phlebotomist will contact you within 2 hours</li>
                <li>• Sample collection at your preferred time</li>
                <li>• Reports delivered via email within test duration</li>
                <li>• Track your booking status anytime</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/")}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Back to Home
              </button>
              <button
                onClick={() => navigate("/products")}
                className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium"
              >
                Book More Tests
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Active step content
  return (
    <div className="min-h-screen bg-gray-50">
      <Header showSearch />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Checkout</h1>
          <p className="text-gray-600">Complete your booking details</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* Step 0: Address */}
          {activeStep === 0 && (
            <>
              <StepHeader title="Collection Address" stepIndex={0} />

              <div>
                <AddressSection
                  customerId={userId}
                  selectedAddress={selectedAddress}
                  onAddressChange={(addr) => setSelectedAddress(addr)}
                />
              </div>

              {/* Actions */}
              <div className="mt-6 flex justify-between">
                <div /> {/* placeholder for alignment */}
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate("/products")}
                    className="px-4 py-2 border rounded"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      const err = validateStep(0);
                      if (err) {
                        toast.error(err);
                        return;
                      }
                      setActiveStep(1);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Step 1: Schedule */}
          {activeStep === 1 && (
            <>
              <StepHeader title="Schedule" stepIndex={1} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date *</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time Slot *</label>
                  <select
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select slot</option>
                    {TIME_SLOTS.map((s) => (<option key={s} value={s}>{s}</option>))}
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <button onClick={() => setActiveStep(0)} className="px-4 py-2 border rounded">Back</button>

                <button
                  onClick={() => {
                    const err = validateStep(1);
                    if (err) { toast.error(err); return; }
                    setActiveStep(2);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Continue
                </button>
              </div>
            </>
          )}

          {/* Step 2: Patients */}
          {activeStep === 2 && (
            <>
              <StepHeader title="Assign Patients to Tests" stepIndex={2} />

              <div className="space-y-4">
                {cartItems.map((it: any) => (
                  <div key={it.id} className="border rounded-lg p-4">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div>
                        <div className="text-base font-semibold text-gray-900">{it.product_name || it.name}</div>
                        <div className="text-sm text-gray-600">{it.product_type || it.type}</div>
                        <div className="text-sm text-gray-700 mt-2">Price: ₹{it.offer_price ?? it.base_price ?? it.price}</div>
                      </div>

                      {/* Patient selection (responsive) */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 w-full md:w-auto">
                        <select
                          defaultValue=""
                          id={`select-patient-${it.id}`}
                          className="w-full sm:w-auto px-3 py-2 border rounded mb-2 sm:mb-0"
                        >
                          <option value="">Select patient</option>
                          {patientsList.map((p) => (
                            <option key={p.id} value={p.id}>{p.first_name}{p.last_name ? ` ${p.last_name}` : ""} {p.mobile ? ` • ${p.mobile}` : ""}</option>
                          ))}
                        </select>

                        <div className="flex gap-2 w-full sm:w-auto">
                          <button
                            onClick={() => {
                              const sel = (document.getElementById(`select-patient-${it.id}`) as HTMLSelectElement).value;
                              if (!sel) { toast.error("Pick a patient to assign"); return; }
                              assignExistingPatientToItem(it.id, Number(sel));
                            }}
                            className="flex-1 sm:flex-none px-3 py-2 bg-blue-600 text-white rounded"
                          >
                            Select
                          </button>

                          <button
                            onClick={() => openPatientModalForItem(it)}
                            className="flex-1 sm:flex-none inline-flex items-center gap-2 px-3 py-2 border rounded text-sm"
                          >
                            <Plus className="w-4 h-4" /> Add
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* chips */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(assignedPatients[String(it.id)] || []).map((p: any) => (
                        <div key={p.id} className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm">
                          <span>{p.first_name}{p.last_name ? ` ${p.last_name}` : ""}</span>
                          <button
                            onClick={() => removeAssignedPatient(it.id, p.id)}
                            className="text-gray-500 hover:text-red-600"
                            title="Remove patient"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-between">
                <button onClick={() => setActiveStep(1)} className="px-4 py-2 border rounded">Back</button>
                <button
                  onClick={() => {
                    const err = validateStep(2);
                    if (err) { toast.error(err); return; }
                    setActiveStep(3);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Continue
                </button>
              </div>
            </>
          )}

          {/* Step 3 (Review & Confirm) */}
          {activeStep === 3 && (
            <>
              <StepHeader title="Review & Create Booking" stepIndex={3} />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div className="border rounded p-4">
                    <h3 className="font-semibold mb-2">Schedule</h3>
                    <div className="text-sm text-gray-700">Date: <span className="font-medium">{selectedDate}</span></div>
                    <div className="text-sm text-gray-700">Time: <span className="font-medium">{selectedSlot}</span></div>
                    <div className="text-sm text-gray-700 mt-2">Address: <span className="font-medium">{selectedAddress?.line1}{selectedAddress?.line2 ? `, ${selectedAddress.line2}` : ""} — {selectedAddress?.city || selectedAddress?.location?.city} {selectedAddress?.pincode ? `- ${selectedAddress.pincode}` : ""}</span></div>
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
                              <div key={p.id} className="text-sm px-3 py-1 rounded-full bg-gray-100">{p.first_name}{p.last_name ? ` ${p.last_name}` : ""}</div>
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
                        <span>₹{totalPrice}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button onClick={() => setActiveStep(2)} className="flex-1 px-4 py-2 border rounded">Back</button>
                      <button
                        onClick={createBooking}
                        disabled={isSubmitting}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded"
                      >
                        {isSubmitting ? "Creating..." : "Confirm Booking"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Patient Modal */}
        {patientModalOpen && patientModalForItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={() => setPatientModalOpen(false)} />
            <div className="w-full max-w-lg bg-white rounded shadow-xl z-10 overflow-auto">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">Create Patient</h3>
                <button onClick={() => setPatientModalOpen(false)} className="text-gray-600 hover:text-gray-900"><X className="w-5 h-5" /></button>
              </div>

              <div className="p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input value={newPatient.first_name} onChange={(e) => setNewPatient(s => ({ ...s, first_name: e.target.value }))} placeholder="First name *" className="px-3 py-2 border rounded" />
                  <input value={newPatient.last_name} onChange={(e) => setNewPatient(s => ({ ...s, last_name: e.target.value }))} placeholder="Last name" className="px-3 py-2 border rounded" />
                  <input value={newPatient.mobile} onChange={(e) => setNewPatient(s => ({ ...s, mobile: e.target.value }))} placeholder="Mobile *" className="px-3 py-2 border rounded" />
                  <input value={newPatient.email} onChange={(e) => setNewPatient(s => ({ ...s, email: e.target.value }))} placeholder="Email" className="px-3 py-2 border rounded" />
                  <select value={newPatient.gender} onChange={(e) => setNewPatient(s => ({ ...s, gender: e.target.value }))} className="px-3 py-2 border rounded">
                    <option value="">Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>

                  <input type="date" value={newPatient.date_of_birth} onChange={(e) => {
                    const dob = e.target.value;
                    let age = "";
                    if (dob) {
                      const diff = Date.now() - new Date(dob).getTime();
                      age = String(Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)));
                    }
                    setNewPatient(s => ({ ...s, date_of_birth: dob, age }));
                  }} max={new Date().toISOString().split("T")[0]} className="px-3 py-2 border rounded" />

                  <input value={newPatient.age} onChange={(e) => setNewPatient(s => ({ ...s, age: e.target.value }))} placeholder="Age" className="px-3 py-2 border rounded" />
                </div>

                <div className="flex gap-2 justify-end">
                  <button onClick={() => setPatientModalOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
                  <button onClick={() => createPatientAndAssign(patientModalForItem.id)} className="px-4 py-2 bg-blue-600 text-white rounded">
                    {creatingPatient ? "Saving..." : "Create & Assign"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
