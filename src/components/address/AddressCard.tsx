// components/address/AddressCard.tsx
import { Pencil } from "lucide-react";

export interface Address {
  id: number;
  line1: string;
  line2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  is_default?: boolean;
  location?: { id: number; city?: string; state?: string; pincode?: string };
  user?: any;
}

interface Props {
  address: Address;
  selected?: boolean;
  disabled?: boolean;
  onClick?: (addr: Address) => void;
  onEdit?: (addr: Address) => void;
}

export default function AddressCard({ address, selected, disabled, onClick, onEdit }: Props) {
  const city = address.city || address.location?.city || "";
  const state = address.state || address.location?.state || "";
  const pincode = address.pincode || address.location?.pincode || "";

  return (
    <div
      role="button"
      onClick={() => !disabled && onClick?.(address)}
      className={`relative p-4 rounded-lg transition-shadow cursor-pointer
        ${selected ? "border-2 border-blue-600 shadow-md" : "border border-gray-200"}
        ${disabled ? "opacity-60 cursor-not-allowed" : "hover:shadow-lg"}
        bg-white`}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit?.(address);
        }}
        aria-label="Edit address"
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        type="button"
      >
        <Pencil className="w-4 h-4" />
      </button>

      <div className="text-sm font-semibold text-gray-900">{address.line1}</div>
      {address.line2 && (
        <div className="text-sm text-gray-700 mt-1">{address.line2}</div>
      )}
      <div className="text-sm text-gray-600 mt-2">
        {city}{city && state ? ", " : ""}{state} {pincode ? `- ${pincode}` : ""}
      </div>
      {address.is_default && (
        <div className="mt-2 text-xs text-green-700">✅ Default Address</div>
      )}
    </div>
  );
}
