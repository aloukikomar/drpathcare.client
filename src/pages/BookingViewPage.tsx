// src/pages/BookingViewPage.tsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { customerApi } from "../api/axios";
import { format } from "date-fns";
import {
    ArrowLeft,
    Printer,
    MapPin,
    Calendar,
    FileText,
    Phone,
    User,
    Mail,
} from "lucide-react";

/**
 * Booking view (read-only, printable).
 * Route: /booking/:id
 */

const statusColor = (status: string) => {
    if (!status) return "bg-gray-100 text-gray-800 border-gray-200";
    switch (status.toLowerCase()) {
        case "confirmed":
        case "payment_collected":
        case "completed":
            return "bg-green-100 text-green-800 border-green-200";
        case "verified":
        case "initiated":
            return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case "sample_collected":
            return "bg-orange-100 text-orange-800 border-orange-200";
        case "report_uploaded":
            return "bg-purple-100 text-purple-800 border-purple-200";
        case "failed":
        case "cancelled":
            return "bg-red-100 text-red-800 border-red-200";
        default:
            return "bg-gray-100 text-gray-800 border-gray-200";
    }
};

const safe = (v: any, fallback = "—") => (v === null || v === undefined || v === "" ? fallback : v);

const BookingViewPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [booking, setBooking] = useState<any | null>(null);
    const printRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!id) {
            setError("Missing booking id");
            setLoading(false);
            return;
        }
        let mounted = true;
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const res: any = await customerApi.get(`client/bookings/${id}/`);
                if (!mounted) return;
                setBooking(res);
            } catch (err: any) {
                console.error("load booking", err);
                setError(err?.message || "Unable to load booking");
            } finally {
                if (mounted) setLoading(false);
            }
        };
        load();
        return () => {
            mounted = false;
        };
    }, [id]);

    const onPrint = () => {
        window.print();
    };

    // const addressText = (ad: any) => {
    //     if (!ad) return "No address";
    //     const parts = [
    //         ad.line1,
    //         ad.line2,
    //         ad.location?.city,
    //         ad.location?.state,
    //         ad.location?.pincode,
    //     ].filter(Boolean);
    //     return parts.join(", ");
    // };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="text-gray-500">Loading booking…</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="bg-white p-6 rounded shadow text-red-600">{error}</div>
            </div>
        );
    }

    if (!booking) {
        return null;
    }

    const status = (booking.customer_status || booking.status || "").toString();
    const items = booking.items || [];

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">
            {/* Print styles scoped to this page */}
            <style>{`
        @media print {
          body * { visibility: hidden; }
          #booking-print-area, #booking-print-area * { visibility: visible; }
          #booking-print-area { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
          .print-card { box-shadow: none !important; border-radius: 0 !important; }
        }
      `}</style>

            <div className="max-w-4xl mx-auto">
                {/* Header: back + ref + actions */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between no-print">

                    {/* LEFT: Back + Title */}
                    <div className="flex items-center gap-3 flex-1 sm:flex-none">
                        <button
                            onClick={() => navigate(-1)}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border bg-white hover:shadow-sm transition"
                            aria-label="Back"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </button>

                        <div className="min-w-0">
                            <h1 className="text-lg sm:text-xl font-semibold truncate">Booking Details</h1>
                            <div className="text-sm text-gray-600 truncate">
                                Ref: <span className="font-medium">{safe(booking.ref_id)}</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: ONLY Print Button */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-end">
                        <button
                            onClick={onPrint}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-white 
                       hover:from-primary hover:to-secondary hover:bg-gradient-to-r transition"
                        >
                            <Printer className="w-4 h-4" />
                            Print / Download
                        </button>
                    </div>
                </div>


                {/* Card (print target) */}
                <div id="booking-print-area" ref={printRef as any} className="print-card bg-white rounded-lg shadow p-6">
                    {/* Top header */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                        <div>
                            <div className="text-sm text-gray-500">Booking Date</div>
                            <div className="text-base font-medium">
                                {booking.created_at ? format(new Date(booking.created_at), "dd MMM yyyy") : "—"}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">Ref ID: <span className="font-semibold">{safe(booking.ref_id)}</span></div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className={`text-xs px-2 py-1 rounded-full border ${statusColor(status)}`}>
                                {status ? status.replace(/_/g, " ").toUpperCase() : "—"}
                            </div>
                        </div>
                    </div>

                    {/* Customer + Address */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">

                        {/* CUSTOMER CARD */}
                        <div className="bg-gray-50 p-4 rounded-lg border">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <User className="w-4 h-4 text-primary" /> Customer Details
                            </h3>

                            <div className="space-y-1">
                                <div className="text-base font-semibold text-gray-900">
                                    {booking.user_detail?.first_name ?? booking.user_name ?? "—"}{" "}
                                    {booking.user_detail?.last_name ?? ""}
                                </div>

                                <div className="text-sm text-gray-600 flex items-center gap-2 mt-2">
                                    <Mail className="w-4 h-4 text-primary" />
                                    {booking.user_detail?.email ?? booking.user_email ?? "—"}
                                </div>

                                <div className="text-sm text-gray-600 flex items-center gap-2 mt-2">
                                    <Phone className="w-4 h-4 text-primary" />
                                    {booking.address_detail?.user_mobile ??
                                        booking.user_detail?.mobile ??
                                        "—"}
                                </div>
                            </div>
                        </div>

                        {/* ADDRESS CARD */}
                        <div className="bg-gray-50 p-4 rounded-lg border">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary" /> Collection Address
                            </h3>

                            {booking.address_detail ? (
                                <div className="space-y-1 text-sm text-gray-700">
                                    <div>{safe(booking.address_detail?.line1)}</div>
                                    {booking.address_detail?.line2 && (
                                        <div>{booking.address_detail.line2}</div>
                                    )}

                                    <div className="mt-2 flex items-start gap-1 text-gray-600">
                                        {/* <MapPin className="w-4 h-4 text-primary mt-0.5" /> */}
                                        <span className="leading-5">
                                            {[
                                                booking.address_detail?.location?.city,
                                                booking.address_detail?.location?.state,
                                                booking.address_detail?.location?.pincode,
                                            ]
                                                .filter(Boolean)
                                                .join(", ")}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-sm text-gray-500">No address provided</div>
                            )}
                        </div>
                    </div>


                    {/* Schedule */}
                    <div className="mt-6 border-t pt-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                            <div className="flex items-center gap-3">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <div>
                                    <div className="text-sm text-gray-600">Scheduled</div>
                                    <div className="font-medium">
                                        {booking.scheduled_date ? format(new Date(booking.scheduled_date), "dd MMM yyyy") : "—"}
                                        {booking.scheduled_time_slot ? ` • ${booking.scheduled_time_slot}` : ""}
                                    </div>
                                </div>
                            </div>

                            <div className="text-sm text-gray-600 flex items-center gap-3">
                                <FileText className="w-4 h-4" />
                                <div>
                                    Booking status: <span className="font-medium ml-1">{(booking.customer_status || booking.status || "—").replace(/_/g, " ")}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Items table + Payment summary */}
                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Items (wide) */}
                        <div className="lg:col-span-2">
                            <h4 className="text-sm font-semibold mb-3">Tests & Packages</h4>
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-xs text-gray-500 border-b">
                                            <th className="py-2 pr-4">Patient</th>
                                            <th className="py-2 pr-4">Item</th>
                                            <th className="py-2 pr-4">Type</th>
                                            <th className="py-2 pr-4 text-right">Base (₹)</th>
                                            <th className="py-2 pr-4 text-right">Offer (₹)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((it: any) => {
                                            const patient = it.patient_detail ?? it.patient;
                                            const itemName = it.lab_test_detail?.name ?? it.profile_detail?.name ?? it.package_detail?.name ?? "—";
                                            const itemType = it.lab_test_detail ? "Test" : it.profile_detail ? "Profile" : it.package_detail ? "Package" : "-";
                                            return (
                                                <tr key={it.id} className="border-b last:border-b-0">
                                                    <td className="py-3 pr-4 align-top">
                                                        <div className="font-medium">{patient?.first_name} {patient?.last_name}</div>
                                                        <div className="text-xs text-gray-500">{patient?.user_mobile ?? patient?.mobile ?? ""}</div>
                                                    </td>
                                                    <td className="py-3 pr-4 align-top">{itemName}</td>
                                                    <td className="py-3 pr-4 align-top">{itemType}</td>
                                                    <td className="py-3 pr-4 text-right align-top">₹{safe(it.base_price, "0")}</td>
                                                    <td className="py-3 pr-4 text-right align-top">₹{safe(it.offer_price, "0")}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Payment summary */}
                        <div className="bg-gray-50 p-4 rounded border">
                            <h4 className="text-sm font-semibold mb-3">Payment Summary</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <div className="text-gray-600">Base Total</div>
                                    <div className="font-medium">₹{safe(booking.base_total, "0")}</div>
                                </div>

                                <div className="flex justify-between">
                                    <div className="text-gray-600">Offer Total</div>
                                    <div className="font-medium">₹{safe(booking.offer_total, "0")}</div>
                                </div>

                                <div className="flex justify-between text-red-600">
                                    <div className="text-gray-600">Total Discount</div>
                                    <div className="font-medium">-₹{safe(booking.discount_amount ?? booking.total_savings, "0")}</div>
                                </div>

                                <div className="flex justify-between pt-2 border-t">
                                    <div className="text-gray-700 font-medium">Final Amount</div>
                                    <div className="text-green-700 font-semibold">₹{safe(booking.final_amount, "0")}</div>
                                </div>

                                <div className="flex justify-between pt-3">
                                    <div className="text-gray-600">Payment Status</div>
                                    <div className="font-medium">{(booking.payment_status || "—").toString()}</div>
                                </div>

                                <div className="flex justify-between">
                                    <div className="text-gray-600">Booking Status</div>
                                    <div className="font-medium">{(booking.customer_status || booking.status || "—").toString()}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        Thank you for choosing <strong>Dr Pathcare Diagnostics</strong>.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingViewPage;
