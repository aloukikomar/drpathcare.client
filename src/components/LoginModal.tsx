import React, { useState, useEffect } from "react";
import { globalApi } from "../api/axios";
import { useToast } from "../context/ToastManager";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess?: (user: any, tokens: { access: string; refresh: string }) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
    const [step, setStep] = useState<"mobile" | "otp" | "signup">("mobile");
    const [loading, setLoading] = useState(false);
    const [mobile, setMobile] = useState("");
    const [otp, setOtp] = useState("");
    const [timer, setTimer] = useState(0);

    // Signup info (only if new user)
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [age, setAge] = useState("18");
    const [gender, setGender] = useState("Male");
    const { showToast } = useToast();

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer((t) => (t > 0 ? t - 1 : 0)), 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    if (!isOpen) return null;

    // -------------------------------
    // 🔹 Step 1: Send OTP
    // -------------------------------
    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!/^\d{10}$/.test(mobile)) {
            showToast("Please enter a valid 10-digit mobile number", "error");
            return;
        }

        setLoading(true);
        try {
            const res = await globalApi.post("auth/send-otp/", { mobile });
            showToast("OTP sent successfully", "success");
            setTimer(30);
            setStep(res.is_user ? "otp" : "signup");
        } catch (err: any) {
            showToast(err.response?.data?.error || "Failed to send OTP", "error");
        } finally {
            setLoading(false);
        }
    };

    // -------------------------------
    // 🔹 Step 2/3: Verify OTP
    // -------------------------------
    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!/^\d{4,6}$/.test(otp)) {
            showToast("Please enter a valid OTP", "error");
            return;
        }

        setLoading(true);
        try {
            // Base payload
            const payload: Record<string, any> = { mobile, otp };

            // Include signup fields only if needed
            if (step === "signup") {
                Object.assign(payload, {
                    first_name: firstName,
                    last_name: lastName,
                    email,
                    gender,
                });
            }

            // 🧹 Remove blank or undefined fields
            const cleanPayload = Object.fromEntries(
                Object.entries(payload).filter(
                    ([, value]) => value !== "" && value !== null && value !== undefined
                )
            );

            const data = await globalApi.post("auth/verify-customer-otp/", cleanPayload);
            showToast("Login successful!", "success");

            localStorage.setItem("access", data.access);
            localStorage.setItem("refresh", data.refresh);
            localStorage.setItem("user", JSON.stringify(data.user));
            window.location.reload();

            onLoginSuccess?.(data.user, { access: data.access, refresh: data.refresh });
            onClose();
        } catch (err: any) {
            showToast(err.response?.data?.error || "OTP verification failed", "error");
        } finally {
            setLoading(false);
        }
    };

    // -------------------------------
    // 🔹 UI
    // -------------------------------
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                >
                    ✕
                </button>

                <h2 className="text-2xl font-semibold text-center text-gray-900 mb-4">
                    {step === "mobile"
                        ? "Login / Sign Up"
                        : step === "otp"
                            ? "Verify OTP"
                            : "Complete Registration"}
                </h2>

                {/* Step 1 - Mobile */}
                {step === "mobile" && (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                        <input
                            type="tel"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                            placeholder="Enter your mobile number"
                            maxLength={10}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                        w-full py-3 rounded-lg text-white font-medium
                                        bg-primary
                                        transition-all
                                        hover:bg-gradient-to-r hover:from-primary hover:to-secondary
                                        hover:shadow-md
                                        active:scale-[.98]
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                    "
                        >
                            {loading ? "Sending..." : "Get OTP"}
                        </button>

                        <p className="text-sm text-center text-gray-500">
                            You’ll receive an OTP on your registered mobile number.
                        </p>
                    </form>
                )}

                {/* Step 2 - Existing user OTP */}
                {step === "otp" && (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                        <p className="text-center text-gray-700">
                            OTP sent to <strong>{mobile}</strong>
                        </p>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                            placeholder="Enter OTP"
                            maxLength={6}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                        <div className="flex items-center justify-between">
                            {timer > 0 ? (
                                <span className="text-sm text-gray-500">Resend in {timer}s</span>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleSendOtp}
                                    className="text-primary text-sm font-medium"
                                >
                                    Resend OTP
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => setStep("mobile")}
                                className="text-gray-500 text-sm"
                            >
                                Change Number
                            </button>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                        w-full py-3 rounded-lg text-white font-medium
                                        bg-primary
                                        transition-all
                                        hover:bg-gradient-to-r hover:from-primary hover:to-secondary
                                        hover:shadow-md
                                        active:scale-[.98]
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                    "
                        >
                            {loading ? "Verifying..." : "Verify & Login"}
                        </button>
                    </form>
                )}

                {/* Step 3 - New user signup + OTP */}
                {step === "signup" && (
                    <form onSubmit={handleVerifyOtp} className="space-y-3">
                        <p className="text-center text-gray-700">
                            OTP sent to <strong>{mobile}</strong>
                        </p>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                            placeholder="Enter OTP"
                            maxLength={6}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary"
                        />
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="First Name"
                                className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary"
                            />
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Last Name"
                                className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email (optional)"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary"
                        />
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="age"
                                value={age}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "").slice(0, 2);
                                    setAge(value);
                                }}
                                placeholder="Age (optional)"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary"
                            />
                            <select
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary"
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="flex items-center justify-between">
                            {timer > 0 ? (
                                <span className="text-sm text-gray-500">Resend in {timer}s</span>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleSendOtp}
                                    className="text-primary text-sm font-medium"
                                >
                                    Resend OTP
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => setStep("mobile")}
                                className="text-gray-500 text-sm"
                            >
                                Change Number
                            </button>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                        w-full py-3 rounded-lg text-white font-medium
                                        bg-primary
                                        transition-all
                                        hover:bg-gradient-to-r hover:from-primary hover:to-secondary
                                        hover:shadow-md
                                        active:scale-[.98]
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                    "
                        >
                            {loading ? "Verifying..." : "Register & Continue"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default LoginModal;
