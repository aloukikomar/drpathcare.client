// src/components/checkout/PatientModal.tsx
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { customerApi } from "../api/axios";
import { toast } from "react-toastify";

export default function PatientModal({
    customerId,
    open,
    onClose,
    editingPatient,
    onSaved,
}: {
    customerId?: number | null;
    open: boolean;
    onClose: () => void;
    forItem?: any | null;
    editingPatient?: any | null;
    onSaved?: () => void;
}) {
    const [form, setForm] = useState<any>({
        first_name: "",
        last_name: "",
        mobile: "",
        email: "",
        gender: "Male",
        age: "",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editingPatient) {
            setForm({
                first_name: editingPatient.first_name || "",
                last_name: editingPatient.last_name || "",
                mobile: editingPatient.mobile || "",
                email: editingPatient.email || "",
                gender: editingPatient.gender || "Male",
                age: editingPatient.age ? String(editingPatient.age) : "",
            });
        } else {
            setForm({
                first_name: "",
                last_name: "",
                mobile: "",
                email: "",
                gender: "Male",
                age: "",
            });
        }
    }, [editingPatient, open]);

    if (!open) return null;

    const handleSave = async () => {
        if (!form.first_name || !form.age) return toast.error("Name and age are required");
        setLoading(true);
        try {
            if (editingPatient && editingPatient.id) {
                // edit
                const payload = {
                    id:editingPatient.id,
                    first_name: form.first_name,
                    last_name: form.last_name,
                    alt_mobile: form.mobile,
                    email: form.email,
                    gender: form.gender,
                    age: form.age ? Number(form.age) : null,
                };
                await customerApi.patch(`client/patients/${editingPatient.id}/`, payload);
                toast.success("Patient updated");
            } else {
                // create
                
                const payload = {
                    user: customerId,
                    first_name: form.first_name,
                    last_name: form.last_name,
                    alt_mobile: form.mobile,
                    email: form.email,
                    gender: form.gender,
                    age: form.age ? Number(form.age) : null,
                };
                await customerApi.post("client/patients/", payload);
                toast.success("Patient created");
            }

            // notify parent to refresh patient list
            window.dispatchEvent(new Event("patients-updated"));
            onSaved?.();
            onClose();
        } catch (err: any) {
            console.error("patient save", err);
            toast.error(err?.response?.data?.detail || "Failed to save patient");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="w-full max-w-lg bg-white rounded shadow-xl z-10 overflow-auto">
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-lg font-semibold">{editingPatient ? "Edit Patient" : "Create Patient"}</h3>
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-900"><X className="w-5 h-5" /></button>
                </div>

                <div className="p-4 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} placeholder="First name *" className="px-3 py-2 border rounded" />
                        <input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} placeholder="Last name" className="px-3 py-2 border rounded" />
                        <input value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} placeholder="Mobile" className="px-3 py-2 border rounded" />
                        <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="px-3 py-2 border rounded" />
                        <select
                            value={form.gender}
                            onChange={(e) => setForm({ ...form, gender: e.target.value })}
                            className="px-3 py-2 border rounded"
                        >
                            <option value="Male">Male</option>      {/* default */}
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>

                        <input value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} placeholder="Age *" className="px-3 py-2 border rounded" />
                    </div>

                    <div className="flex gap-2 justify-end">
                        <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
                        <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded">
                            {loading ? "Saving..." : editingPatient ? "Save changes" : "Create & Assign"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
