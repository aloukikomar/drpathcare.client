import React, { useEffect, useState } from "react";
import { globalApi } from "../api/axios";
import { useToast } from "../context/ToastManager";

interface Props {
    open: boolean;
    onClose: () => void;
}

const GetCallbackModal: React.FC<Props> = ({ open, onClose }) => {
    const [form, setForm] = useState({ name: "", mobile: "", enquiry: "" });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    // prevent background scroll when modal open (keeps behaviour consistent with other modals)
    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    if (!open) return null;

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault?.();

        // basic validation
        if (!form.name.trim() || (form.mobile || "").replace(/\D/g, "").length < 10) {
            showToast("Please enter a valid name and 10-digit mobile number.", "info");
            return;
        }

        setLoading(true);
        try {
            await globalApi.post("crm/enquiries/", {
                name: form.name.trim(),
                mobile: form.mobile.replace(/\D/g, "").slice(0, 10),
                enquiry: form.enquiry.trim(),
                tag: "callback", // optional: your backend may accept tagging
            });

            setSubmitted(true);
            setForm({ name: "", mobile: "", enquiry: "" });
            showToast("Request submitted! Our agent will call you soon.", "success");

            // keep success visible briefly then close (optional)
            setTimeout(() => {
                setSubmitted(false);
                onClose();
            }, 2200);
        } catch (err) {
            console.error("Enquiry submit failed", err);
            showToast("Failed to submit. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed !mt-0 inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full relative">
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
                    aria-label="Close"
                >
                    ✕
                </button>

                <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
                    Request a Callback
                </h3>
                <p className="text-gray-600 text-sm text-center mb-4">
                    Our advisor will call you shortly to help with booking your lab test.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        required
                        type="text"
                        placeholder="Your Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value.slice(0, 50) })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:border-primary focus:ring-2 focus:ring-primary"
                    />

                    <input
                        required
                        type="tel"
                        placeholder="Mobile No."
                        value={form.mobile}
                        onChange={(e) =>
                            setForm({ ...form, mobile: e.target.value.replace(/\D/g, "").slice(0, 10) })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:border-primary focus:ring-2 focus:ring-primary"
                    />

                    <textarea
                        required
                        placeholder="Your enquiry"
                        rows={3}
                        value={form.enquiry}
                        onChange={(e) => setForm({ ...form, enquiry: e.target.value.slice(0, 500) })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:border-primary focus:ring-2 focus:ring-primary resize-none"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2.5 rounded-lg text-white text-sm font-medium transition-all
              ${loading ? "bg-primary/70 cursor-wait" : "bg-primary hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:shadow-md"}`}
                    >
                        {loading ? "Requesting..." : "Request Callback"}
                    </button>

                    {submitted && (
                        <p className="text-green-600 text-xs mt-1 text-center">
                            Request submitted — we will call you shortly.
                        </p>
                    )}
                </form>

                <div className="text-center mt-5 border-t pt-4 text-sm text-gray-700">
                    <div className="text-xs text-gray-500 mb-2">Or call us directly</div>

                    <div className="font-semibold flex justify-center items-center gap-3">
                        <span>📞 +91 8447007794</span>
                        <span className="text-gray-400">|</span>
                        <span>📞 0120-4207810</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default GetCallbackModal;
