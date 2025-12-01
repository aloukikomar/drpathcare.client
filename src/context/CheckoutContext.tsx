// src/context/CheckoutContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { customerApi } from "../api/axios";
import type { Address } from "../components/address/AddressCard";
import { useToast } from "../context/ToastManager";

type AnyObj = Record<string, any>;

export type PatientsMap = Record<string, AnyObj[]>;

type ContextType = {
    cartItems: AnyObj[];
    setCartItems: React.Dispatch<React.SetStateAction<AnyObj[]>>;

    totalPrice: number;
    setTotalPrice: React.Dispatch<React.SetStateAction<number>>;

    selectedAddress: Address | null;
    setSelectedAddress: (a: Address | null) => void;

    selectedDate: string;
    setSelectedDate: React.Dispatch<React.SetStateAction<string>>;

    selectedSlot: string;
    setSelectedSlot: React.Dispatch<React.SetStateAction<string>>;

    assignedPatients: PatientsMap;
    setAssignedPatients: React.Dispatch<React.SetStateAction<PatientsMap>>;

    patientsList: AnyObj[];
    refreshPatients: () => Promise<void>;

    fetchCart: () => Promise<void>;
    userId: number | null;
};

const CheckoutContext = createContext<ContextType | null>(null);

export const useCheckout = () => {
    const ctx = useContext(CheckoutContext);
    if (!ctx) throw new Error("useCheckout must be used inside CheckoutProvider");
    return ctx;
};

export const CheckoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<AnyObj[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedSlot, setSelectedSlot] = useState<string>("");

    const [assignedPatients, setAssignedPatients] = useState<PatientsMap>({});
    const [patientsList, setPatientsList] = useState<AnyObj[]>([]);
    const { showToast } = useToast();

    const localUser =
        typeof window !== "undefined"
            ? JSON.parse(localStorage.getItem("user") || "null")
            : null;

    const userId = localUser?.id ?? null;

    // -------------------------------
    // Fetch CART
    // -------------------------------
    const fetchCart = async () => {
        try {
            const res: any = await customerApi.get("carts/");
            const data = res?.data ?? res ?? {};

            let cart: any = null;
            if (Array.isArray(data)) cart = data[0];
            else if (data?.results) cart = data.results[0];
            else cart = data;

            const items = cart?.items ?? [];
            setCartItems(items);

            // preserve old assignments but ensure each item exists
            setAssignedPatients((prev) => {
                const updated: PatientsMap = { ...prev };
                items.forEach((it: any) => {
                    const id = String(it.id);
                    if (!updated[id]) updated[id] = [];
                });
                return updated;
            });

            const tp =
                parseFloat(cart?.total_price || "0") ||
                items.reduce((sum: number, it: any) => {
                    const price = parseFloat(it.offer_price ?? it.base_price ?? it.price ?? 0);
                    return sum + price * (it.quantity ?? 1);
                }, 0);

            setTotalPrice(tp);
        } catch (err) {
            console.error("fetchCart error", err);
            showToast("Unable to load cart", "error")
        }
    };

    // -------------------------------
    // Fetch PATIENTS
    // -------------------------------
    const refreshPatients = async () => {
        try {
            const res: any = await customerApi.get("client/patients/");
            const list = res?.results ?? res?.data?.results ?? res?.data ?? res;
            const arr = Array.isArray(list) ? list : [list];
            setPatientsList(arr);
        } catch (err) {
            console.error("refreshPatients error", err);
        }
    };

    useEffect(() => {
        fetchCart();
        refreshPatients();
    }, []);

    return (
        <CheckoutContext.Provider
            value={{
                cartItems,
                setCartItems,
                totalPrice,
                setTotalPrice,
                selectedAddress,
                setSelectedAddress,
                selectedDate,
                setSelectedDate,
                selectedSlot,
                setSelectedSlot,
                assignedPatients,
                setAssignedPatients,
                patientsList,
                refreshPatients,
                fetchCart,
                userId,
            }}
        >
            {children}
        </CheckoutContext.Provider>
    );
};
