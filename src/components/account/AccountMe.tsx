// src/components/account/AccountMe.tsx
import React, { useEffect, useState } from "react";
import { customerApi } from "../../api/axios";
import { Loader, User2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const computeAgeFromDOB = (dob?: string | null) => {
    if (!dob) return null;
    try {
        const diff = Date.now() - new Date(dob).getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    } catch {
        return null;
    }
};

const AccountMe: React.FC = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [, setUser] = useState<any>(null);
    const [stats, setStats] = useState<any>({});

    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        mobile: "",
        email: "",
        age: "",
        gender: "",
    });

    const [dirty, setDirty] = useState(false);

    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            const res: any = await customerApi.get("client/me/");
            const u = res?.user ?? null;
            setUser(u);
            setStats(res?.stats ?? {});
            const ageVal = u?.age ?? computeAgeFromDOB(u?.date_of_birth) ?? "";
            setForm({
                first_name: u?.first_name ?? "",
                last_name: u?.last_name ?? "",
                mobile: u?.mobile ?? "",
                email: u?.email ?? "",
                age: ageVal ? String(ageVal) : "",
                gender: u?.gender ?? "",
            });
            setDirty(false);
        } catch {
            setError("Unable to load profile.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const onField = (k: keyof typeof form, v: string) => {
        setForm((prev) => ({ ...prev, [k]: v }));
        setDirty(true);
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        try {
            const payload: any = {
                first_name: form.first_name.trim(),
                last_name: form.last_name.trim(),
                email: form.email.trim(),
                gender: form.gender || null,
            };
            if (form.age) payload.age = Number(form.age);

            await customerApi.patch("client/me/", payload);
            await load();
        } catch (err: any) {
            setError(err?.message || "Failed to save profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="py-10 text-center">
                <Loader className="w-6 h-6 animate-spin mx-auto text-gray-500" />
            </div>
        );
    }

    const initials = `${(form.first_name?.[0] ?? "")}${(form.last_name?.[0] ?? "")}`.toUpperCase();

    return (
        <section className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex flex-col md:flex-row gap-6">
                {/* LEFT: CENTER aligned Avatar + Mobile */}
                <div className="md:w-1/3 flex flex-col items-center gap-4 text-center">
                    <div className="w-36 h-36 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold">
                        {initials || <User2 size={36} />}
                    </div>

                    <div className="w-full md:w-auto">
                        <label className="text-sm font-medium text-gray-700 block mb-1">Mobile</label>
                        <input
                            value={form.mobile}
                            readOnly
                            className="w-full px-3 py-2 rounded border bg-gray-100 text-gray-700 cursor-not-allowed text-center"
                        />
                    </div>
                </div>

                {/* RIGHT: FORM */}
                <div className="md:w-2/3 flex-1">
                    {/* Row 1: First | Last */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">First name</label>
                            <input
                                value={form.first_name}
                                onChange={(e) => onField("first_name", e.target.value)}
                                className="mt-1 w-full px-3 py-2 rounded border border-gray-300 focus:border-primary"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">Last name</label>
                            <input
                                value={form.last_name}
                                onChange={(e) => onField("last_name", e.target.value)}
                                className="mt-1 w-full px-3 py-2 rounded border border-gray-300 focus:border-primary"
                            />
                        </div>
                    </div>

                    {/* Row 2: Email (large) | Age (small) | Gender (small) */}
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mt-4">
                        <div className="sm:col-span-3">
                            <label className="text-sm font-medium text-gray-700">Email</label>
                            <input
                                value={form.email}
                                onChange={(e) => onField("email", e.target.value)}
                                className="mt-1 w-full px-3 py-2 rounded border border-gray-300 focus:border-primary"
                            />
                        </div>

                        <div className="sm:col-span-1">
                            <label className="text-sm font-medium text-gray-700">Age</label>
                            <input
                                value={form.age}
                                inputMode="numeric"
                                onChange={(e) => onField("age", e.target.value.replace(/\D/g, "").slice(0, 2))}
                                className="mt-1 w-full px-3 py-2 rounded border border-gray-300 focus:border-primary"
                            />
                        </div>

                        <div className="sm:col-span-1">
                            <label className="text-sm font-medium text-gray-700">Gender</label>
                            <select
                                value={form.gender}
                                onChange={(e) => onField("gender", e.target.value)}
                                className="mt-1 w-full px-3 py-2 rounded border border-gray-300 focus:border-primary"
                            >
                                <option value="">Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    {/* Save */}
                    <div className="mt-6">
                        <button
                            disabled={!dirty || saving}
                            onClick={handleSave}
                            className={`w-full py-3 rounded-lg text-white font-medium transition-all active:scale-[.98]
                ${dirty
                                    ? "bg-primary hover:bg-gradient-to-r hover:from-primary hover:to-secondary"
                                    : "bg-gray-300 cursor-not-allowed"
                                }`}
                        >
                            {saving ? "Updating..." : "Update Profile"}
                        </button>

                        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
                    </div>
                </div>
            </div>

            {/* Widgets are now LINKS */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">

                {/* BOOKINGS */}
                <button
                    onClick={() => navigate("/account?tab=bookings")}
                    className="
      bg-gray-50 p-4 rounded-lg border text-center 
      hover:bg-gray-100 transition group
    "
                >
                    <div
                        className="
        text-2xl font-bold text-primary
        group-hover:text-transparent group-hover:bg-clip-text 
        group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary
        transition-all
      "
                    >
                        {stats?.total_bookings ?? 0}
                    </div>

                    <div
                        className="
        text-xs text-gray-500
        group-hover:text-transparent group-hover:bg-clip-text 
        group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary
        transition-all
      "
                    >
                        Bookings
                    </div>
                </button>

                {/* REPORTS */}
                <button
                    onClick={() => navigate("/account?tab=reports")}
                    className="
      bg-gray-50 p-4 rounded-lg border text-center 
      hover:bg-gray-100 transition group
    "
                >
                    <div
                        className="
        text-2xl font-bold text-primary
        group-hover:text-transparent group-hover:bg-clip-text 
        group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary
        transition-all
      "
                    >
                        {stats?.total_reports ?? 0}
                    </div>

                    <div
                        className="
        text-xs text-gray-500
        group-hover:text-transparent group-hover:bg-clip-text 
        group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary
        transition-all
      "
                    >
                        Reports
                    </div>
                </button>

                {/* PAYMENTS */}
                <button
                    onClick={() => navigate("/account?tab=payments")}
                    className="
      bg-gray-50 p-4 rounded-lg border text-center 
      hover:bg-gray-100 transition group
    "
                >
                    <div
                        className="
        text-2xl font-bold text-primary
        group-hover:text-transparent group-hover:bg-clip-text 
        group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary
        transition-all
      "
                    >
                        ₹{stats?.total_payments ?? "0"}
                    </div>

                    <div
                        className="
        text-xs text-gray-500
        group-hover:text-transparent group-hover:bg-clip-text 
        group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary
        transition-all
      "
                    >
                        Total Paid
                    </div>
                </button>

            </div>

        </section>
    );
};

export default AccountMe;
