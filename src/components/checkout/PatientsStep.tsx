import React, { useEffect, useRef, useState } from "react";
import StepHeader from "./StepHeader";
import { useCheckout } from "../../context/CheckoutContext";
import AssignedPatientChip from "./AssignedPatientChip";
import { toast } from "react-toastify";
import { Search, Plus } from "lucide-react";

const PatientsStep: React.FC<{
    openPatientModal: (item: any, editPatient?: any) => void;
}> = ({ openPatientModal }) => {
    const {
        cartItems,
        patientsList,
        assignedPatients,
        setAssignedPatients,
        refreshPatients,
    } = useCheckout();

    const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [searchText, setSearchText] = useState("");

    /* -------------------------------
        Refresh after create/edit
    -------------------------------- */
    useEffect(() => {
        const handler = () => refreshPatients();
        window.addEventListener("patients-updated", handler);
        return () => window.removeEventListener("patients-updated", handler);
    }, [refreshPatients]);

    /* -------------------------------
        Close dropdown on outside click
    -------------------------------- */
    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (!openDropdown) return;
            const box = dropdownRefs.current[openDropdown];
            if (box && !box.contains(e.target as Node)) {
                setOpenDropdown(null);
                setSearchText("");
            }
        };
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, [openDropdown]);

    /* -------------------------------
        List Filtering
    -------------------------------- */
    const filtered = patientsList.filter((p: any) =>
        `${p.first_name} ${p.last_name ?? ""} ${p.alt_mobile ?? ""}`
            .toLowerCase()
            .includes(searchText.toLowerCase())
    );

    /* -------------------------------
        Assign Patient
    -------------------------------- */
    const assignPatient = (itemId: string, patient: any) => {
        setAssignedPatients((prev) => {
            const arr = prev[itemId] ? [...prev[itemId]] : [];
            if (arr.some((x) => x.id === patient.id)) {
                toast.info("Patient already assigned");
                return prev;
            }
            return { ...prev, [itemId]: [...arr, patient] };
        });

        setOpenDropdown(null);
        setSearchText("");
    };

    /* -------------------------------
        Remove Assigned
    -------------------------------- */
    const removeAssigned = (itemId: string, patientId: number) => {
        setAssignedPatients((prev) => ({
            ...prev,
            [itemId]: (prev[itemId] || []).filter((p) => p.id !== patientId),
        }));
    };

    /* -------------------------------
        UI Rendering
    -------------------------------- */
    return (
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <StepHeader
                title="Assign Patients to Tests"
                stepIndex={2}
                canChange={Object.values(assignedPatients).flat().length > 0}
                onChange={() => {
                    setAssignedPatients({});
                    toast.info("All patient assignments cleared");
                }}
            />

            <div className="space-y-6">
                {cartItems.map((item) => {
                    const itemId = String(item.id);

                    return (
                        <div key={itemId} className="border rounded-lg p-4 bg-white shadow-sm">
                            {/* ---------------- Product Info ---------------- */}
                            <div className="flex flex-col md:flex-row md:justify-between gap-4">
                                <div>
                                    <div className="text-base font-semibold text-gray-900">
                                        {item.product_name || item.name}
                                    </div>
                                    <div className="text-sm text-gray-600">{item.product_type || item.type}</div>
                                    <div className="text-sm text-gray-700 mt-1">
                                        Price: ₹{item.offer_price ?? item.base_price ?? item.price}
                                    </div>
                                </div>

                                {/* ---------------- Dropdown ---------------- */}
                                <div className="w-full md:w-80 flex flex-col gap-2">
                                    <div
                                        ref={(el) => {
                                            dropdownRefs.current[itemId] = el;
                                        }}
                                        className="relative"
                                    >
                                        {/* Dropdown opener */}
                                        <button
                                            onClick={() =>
                                                setOpenDropdown((p) => (p === itemId ? null : itemId))
                                            }
                                            className="w-full bg-gray-50 border border-gray-300 px-3 py-2 rounded-lg flex justify-between items-center text-sm hover:bg-gray-100"
                                        >
                                            <span>Select patient</span>
                                            <span className="text-gray-400">▼</span>
                                        </button>

                                        {/* Dropdown panel */}
                                        {openDropdown === itemId && (
                                            <div className="absolute z-40 w-full mt-2 bg-white border rounded-lg shadow-lg overflow-hidden animate-fadeIn">

                                                {/* FIXED Search Bar */}
                                                <div className="flex items-center px-3 py-2 border-b bg-gray-50 sticky top-0 z-10">
                                                    <Search className="w-4 h-4 text-gray-400 mr-2" />
                                                    <input
                                                        className="w-full text-sm outline-none bg-gray-50"
                                                        placeholder="Search patients..."
                                                        value={searchText}
                                                        onChange={(e) => setSearchText(e.target.value)}
                                                    />
                                                </div>

                                                {/* SCROLLABLE Patient List */}
                                                <div className="max-h-56 overflow-y-auto">
                                                    {filtered.length === 0 && (
                                                        <div className="p-3 text-sm text-gray-500">No matching patients</div>
                                                    )}

                                                    {filtered.map((p: any) => (
                                                        <div
                                                            key={p.id}
                                                            onClick={() => assignPatient(itemId, p)}
                                                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
                                                        >
                                                            {/* Avatar */}
                                                            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary  flex items-center justify-center font-semibold text-xs">
                                                                {p.first_name?.[0]}
                                                                {p.last_name?.[0]}
                                                            </div>

                                                            <div className="flex flex-col">
                                                                <span className="text-gray-900 text-sm font-medium">
                                                                    {p.first_name} {p.last_name}
                                                                </span>
                                                                <span className="text-xs text-gray-500">
                                                                    {p.gender} • {p.age}
                                                                    {p.alt_mobile ? ` • ${p.alt_mobile}` : ""}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* FIXED Add New Patient Button */}
                                                <button
                                                    onClick={() => {
                                                        setOpenDropdown(null);
                                                        openPatientModal(item);
                                                    }}
                                                    className="w-full flex items-center gap-2 px-3 py-3 border-t bg-white text-sm font-medium hover:bg-gray-50 sticky bottom-0 z-10"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    Add New Patient
                                                </button>
                                            </div>
                                        )}

                                    </div>
                                </div>
                            </div>

                            {/* ---------------- Assigned Chips ---------------- */}
                            <div className="mt-4 flex flex-wrap gap-2">
                                {(assignedPatients[itemId] || []).map((p: any) => (
                                    <AssignedPatientChip
                                        key={p.id}
                                        patient={p}
                                        onEdit={() => openPatientModal(item, p)}
                                        onRemove={() => removeAssigned(itemId, p.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default PatientsStep;
