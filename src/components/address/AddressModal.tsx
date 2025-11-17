// components/address/AddressModal.tsx
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { globalApi } from "../../api/axios";

interface LocationOption {
  id: number;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
}

interface AddressPayload {
  line1: string;
  line2?: string;
  location_id?: number;
  is_default?: boolean;
  user_id?: number;
}

interface AddressModalProps {
  open: boolean;
  onClose: () => void;
  onSaved?: (addr: any) => void;
  address?: any | null; // if present -> edit mode
  customerId?: number | null; // optional
}

export default function AddressModal({ open, onClose, onSaved, address, customerId }: AddressModalProps) {
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [location, setLocation] = useState<LocationOption | null>(null);
  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState<LocationOption[]>([]);
  const [isDefault, setIsDefault] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    // populate when open
    setLine1(address?.line1 || "");
    setLine2(address?.line2 || "");
    setLocation(address?.location || null);
    setIsDefault(Boolean(address?.is_default));
    setError(null);
    setLocationQuery("");
    setLocationResults([]);
  }, [open, address]);

  useEffect(() => {
    if (!locationQuery || locationQuery.length < 2) {
      setLocationResults([]);
      return;
    }

    let cancelled = false;
    (async () => {
      setSearchLoading(true);
      try {
        const res = await globalApi.get(`client/location/?search=${encodeURIComponent(locationQuery)}`);
        const results = res.data?.results || res.data || [];
        if (!cancelled) setLocationResults(results);
      } catch (err) {
        console.error("Location search failed", err);
      } finally {
        if (!cancelled) setSearchLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [locationQuery]);

  const handleSave = async () => {
    setError(null);
    if (!line1?.trim() || !location?.id) {
      setError("Line1 and Location are required");
      return;
    }
    setLoading(true);

    const payload: AddressPayload = {
      line1: line1.trim(),
      line2: line2?.trim(),
      location_id: location.id,
      is_default: isDefault,
    };
    if (customerId) payload.user_id = customerId;

    try {
      if (address?.id) {
        // edit
        const res = await globalApi.patch(`client/addresses/${address.id}/`, payload);
        onSaved?.(res.data);
      } else {
        const res = await globalApi.post(`client/addresses/`, payload);
        onSaved?.(res.data);
      }
      onClose();
    } catch (err: any) {
      console.error("Save address failed", err);
      setError(err?.response?.data?.detail || "Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="ml-auto w-full max-w-md h-full bg-white shadow-xl overflow-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">{address?.id ? "Edit Address" : "Add Address"}</h3>
          <button onClick={onClose} aria-label="Close" className="text-gray-600 hover:text-gray-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {error && <div className="text-sm text-red-600">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-gray-700">Line 1 *</label>
            <input
              value={line1}
              onChange={(e) => setLine1(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Line 2</label>
            <input
              value={line2}
              onChange={(e) => setLine2(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Search Location *</label>
            <input
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              placeholder="Type city or pincode"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            <div className="mt-2 max-h-44 overflow-auto border rounded">
              {searchLoading ? (
                <div className="p-2 text-center text-sm text-gray-500">Searching...</div>
              ) : locationResults.length === 0 ? (
                <div className="p-2 text-sm text-gray-500">Type 2+ chars to search locations</div>
              ) : (
                locationResults.map((loc) => (
                  <div
                    key={loc.id}
                    onClick={() => {
                      setLocation(loc);
                      setLocationQuery(`${loc.city || ""}${loc.city && loc.pincode ? " - " : ""}${loc.pincode || ""}`);
                      setLocationResults([]);
                    }}
                    className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    {loc.city}, {loc.state} {loc.pincode ? `- ${loc.pincode}` : ""}
                  </div>
                ))
              )}
            </div>

            {location && (
              <div className="mt-2 text-sm text-gray-700">
                Selected: {location.city}, {location.state} {location.pincode ? `- ${location.pincode}` : ""}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input id="is_default" type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} />
            <label htmlFor="is_default" className="text-sm text-gray-700">Set as default address</label>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              type="button"
              className="flex-1 py-2 rounded border text-sm"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              type="button"
              className="flex-1 py-2 rounded bg-blue-600 text-white text-sm disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Saving..." : address?.id ? "Update address" : "Save address"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
