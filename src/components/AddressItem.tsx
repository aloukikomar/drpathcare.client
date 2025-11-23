// src/components/account/AddressItem.tsx
import React from "react";
import { MapPin, Pencil, Trash2, Star } from "lucide-react";

const AddressItem: React.FC<{
  addr: any;
  onEdit?: () => void;
  onDelete?: () => void;
  onSetDefault?: () => void;
}> = ({ addr, onEdit, onDelete, onSetDefault }) => {
  const isDefault = addr?.is_default;

  const line1 = addr.line1 || "";
  const line2 = addr.line2 || "";

  const rest = [
    addr.location?.city,
    addr.location?.state,
    addr.location?.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3">

        {/* LEFT */}
        <div className="flex-1 min-w-0">
          {/* Line 1 */}
          <div className="font-semibold text-gray-900 flex items-center gap-2">
            <MapPin size={18} className="text-primary shrink-0" />
            <span>{line1}</span>
          </div>

          {/* Line 2 */}
          {line2 && (
            <div className="mt-1 text-gray-700 text-sm ml-6 sm:ml-8">
              {line2}
            </div>
          )}

          {/* Rest of address */}
          <div className="mt-1 text-gray-600 text-sm ml-6 sm:ml-8">{rest}</div>

          {/* Default badge */}
          {isDefault && (
            <div className="mt-2 inline-flex items-center gap-1 bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 rounded-full text-xs ml-6 sm:ml-8">
              <Star size={12} className="fill-green-700 text-green-700" />
              Default Address
            </div>
          )}
        </div>

        {/* RIGHT BUTTONS */}
        <div className="flex sm:flex-col items-start sm:items-end gap-2">
          <button
            onClick={onEdit}
            className="p-2 border rounded text-gray-600 hover:bg-gray-50 hover:text-primary"
          >
            <Pencil size={16} />
          </button>

          <button
            onClick={onDelete}
            className="p-2 border rounded text-gray-600 hover:bg-gray-50 hover:text-red-600"
          >
            <Trash2 size={16} />
          </button>

          {!isDefault && (
            <button
              onClick={onSetDefault}
              className="p-2 border rounded text-gray-600 hover:bg-gray-50 hover:text-yellow-600"
            >
              <Star size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressItem;
