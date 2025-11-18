// src/components/checkout/AddressStep.tsx
import React from "react";
import StepHeader from "./StepHeader";
import AddressSection from "../address/AddressSection";
import { useCheckout } from "../../context/CheckoutContext";

const AddressStep: React.FC = () => {
  const { selectedAddress, setSelectedAddress, userId } = useCheckout();

  return (
    <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <StepHeader
        title="Collection Address"
        stepIndex={0}
        canChange={!!selectedAddress}
        onChange={() => setSelectedAddress(null)}
      />

      <AddressSection
        customerId={userId}
        selectedAddress={selectedAddress}
        onAddressChange={(addr) => setSelectedAddress(addr)}
      />
    </section>
  );
};

export default AddressStep;
