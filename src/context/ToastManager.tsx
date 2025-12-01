import { createContext, useContext, useState } from "react";

const ToastContext = createContext<any>(null);

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState<{ msg: string; type: string } | null>(null);

    const showToast = (
        msg: string,
        type: "success" | "error" | "info" = "info"
    ) => {
        setToast({ msg, type });

        setTimeout(() => setToast(null), 2000);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Inline Animation */}
            <style>
                {`
        @keyframes toastSlide {
          0% { opacity: 0; transform: translate(-50%, -10px); }
          15% { opacity: 1; transform: translate(-50%, 0px); }
          85% { opacity: 1; transform: translate(-50%, 0px); }
          100% { opacity: 0; transform: translate(-50%, -10px); }
        }
      `}
            </style>

            {toast && (
                <div
                    className={`
            fixed left-1/2 top-6 -translate-x-1/2 z-[9999]
            px-4 py-2 text-sm font-medium rounded-lg shadow-lg 
            text-white 
          `}
                    style={{
                        animation: "toastSlide 2s ease forwards",

                        // Soft solid backgrounds
                        background:
                            toast.type === "success"
                                ? "#EAF8F0" // soft green
                                : toast.type === "error"
                                    ? "#FDECEC" // soft red
                                    : "#EAF2FF", // soft primary blue

                        // Soft bottom accent border
                        borderBottom:
                            toast.type === "success"
                                ? "3px solid #16a34a"   // green-600
                                : toast.type === "error"
                                    ? "3px solid #dc2626"   // red-600
                                    : "3px solid #3b82f6",  // blue-500

                        // Theme-friendly text color
                        color:
                            toast.type === "success"
                                ? "#166534" // deep green
                                : toast.type === "error"
                                    ? "#b91c1c" // deep red
                                    : "#1e40af", // deep blue
                    }}

                >
                    {toast.msg}
                </div>
            )}
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
