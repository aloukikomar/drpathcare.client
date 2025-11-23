// components/address/AddressModal.tsx

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { customerApi } from "../../api/axios";

interface LocationOption {
  id: number;
  city: string;
  state: string;
  pincode: string;
}

interface AddressModalProps {
  open: boolean;
  onClose: () => void;
  onSaved?: (addr: any) => void;
  address?: any | null;
  customerId?: number | null;
}

export default function AddressModal({
  open,
  onClose,
  onSaved,
  address,
  customerId,
}: AddressModalProps) {
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const [locationQuery, setLocationQuery] = useState("");
  const [locationOptions, setLocationOptions] = useState<LocationOption[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationOption | null>(null);

  const [loading, setLoading] = useState(false);
  const [, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Populate modal fields when opened
  useEffect(() => {
    if (!open) return;

    setLine1(address?.line1 || "");
    setLine2(address?.line2 || "");
    setIsDefault(Boolean(address?.is_default));
    setSelectedLocation(address?.location || null);

    // Show city/pincode in input
    setLocationQuery(
      address?.location
        ? `${address.location.city}, ${address.location.state} - ${address.location.pincode}`
        : ""
    );

    setLocationOptions([]);
    setError(null);
  }, [open, address]);

  // Autocomplete search
  useEffect(() => {
    if (locationQuery.length < 2) {
      setLocationOptions([]);
      return;
    }

    let cancelled = false;

    (async () => {
      setSearching(true);
      try {
        const res = await customerApi.get(
          `client/location/?search=${encodeURIComponent(locationQuery)}`
        );
        const list = res.results || res.data?.results || res.data || [];
        if (!cancelled) setLocationOptions(list);
      } catch (err) {
        console.error("Location search failed", err);
      } finally {
        if (!cancelled) setSearching(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [locationQuery]);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setLocationOptions([]);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSave = async () => {
    if (!line1.trim() || !selectedLocation) {
      setError("Line 1 and Location are required");
      return;
    }

    setLoading(true);

    const payload: any = {
      line1: line1.trim(),
      line2: line2.trim(),
      is_default: isDefault,
      location_id: selectedLocation.id,
    };

    // include user id only if adding from customer side
    if (customerId) payload.user_id = customerId;

    try {
      let saved;

      if (address?.id) {
        saved = await customerApi.patch(`client/addresses/${address.id}/`, payload);
      } else {
        saved = await customerApi.post(`client/addresses/`, payload);
      }

      onSaved?.(saved);
      onClose();
    } catch (err: any) {
      console.error("Save Address Error", err);
      setError(err?.response?.data?.detail || "Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div
        className="relative bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 z-10"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {address ? "Edit Address" : "Add Address"}
          </h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500 hover:text-gray-800" />
          </button>
        </div>

        {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

        {/* Line 1 */}
        <label className="block text-sm mb-1">Line 1 *</label>
        <input
          value={line1}
          onChange={(e) => setLine1(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-3"
        />

        {/* Line 2 */}
        <label className="block text-sm mb-1">Line 2</label>
        <input
          value={line2}
          onChange={(e) => setLine2(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-3"
        />

        {/* Location Search */}
        <div className="relative" ref={dropdownRef}>
          <label className="block text-sm mb-1">Location *</label>

          <div className="relative">
            <input
              value={locationQuery}
              onChange={(e) => {
                setLocationQuery(e.target.value);
                setSelectedLocation(null);
              }}
              placeholder="Type pincode"
              className="w-full border px-3 py-2 rounded pr-10"
            />

            {/* Clear button */}
            {locationQuery.length > 0 && (
              <button
                onClick={() => {
                  setLocationQuery("");
                  setSelectedLocation(null);
                  setLocationOptions([]);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Dropdown */}
          {locationOptions.length > 0 && (
            <div className="absolute left-0 right-0 top-full bg-white border rounded shadow-lg mt-1 max-h-60 overflow-y-auto z-40">
              {locationOptions.map((loc) => (
                <div
                  key={loc.id}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => {
                    setSelectedLocation(loc);
                    setLocationQuery(`${loc.city}, ${loc.state} - ${loc.pincode}`);
                    setLocationOptions([]);
                  }}
                >
                  {loc.city}, {loc.state} - {loc.pincode}
                </div>
              ))}
            </div>
          )}
        </div>


        {/* Default toggle */}
        <label className="flex items-center gap-2 mt-4 text-sm">
          <input
            type="checkbox"
            checked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
          />
          Set as default address
        </label>

        {/* Actions */}
        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 border py-2 rounded">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="
    flex-1 rounded py-2 text-white font-medium
    transition-all
    bg-primary
    disabled:opacity-60 disabled:cursor-not-allowed

    hover:bg-gradient-to-r hover:from-primary hover:to-secondary
    hover:shadow-sm
    active:scale-[.98]
  "
          >
            {loading ? "Saving..." : address ? "Update" : "Save"}
          </button>

        </div>
      </div>
    </div>
  );
}
