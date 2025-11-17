// components/address/AddressSection.tsx
import { useEffect, useState } from "react";
import AddressList from "./AddressList";
import type { Address } from "./AddressCard";
import AddressModal from "./AddressModal";
import { Plus } from "lucide-react";
import { customerApi } from "../../api/axios";

interface Props {
  customerId?: number | null; // optional
  selectedAddress?: Address | null;
  onAddressChange?: (addr: Address | null) => void;
  disableChange?: boolean;
  title?: string;
  onSelectedAdvance?: () => void; // called after selection (you wanted auto-advance)
}

export default function AddressSection({
  customerId,
  selectedAddress: externalSelected,
  onAddressChange,
  disableChange = false,
  title = "Collection Address",
  onSelectedAdvance,
}: Props) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Address | null>(externalSelected || null);
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const res = await customerApi.get(`client/addresses/`);
      const list = res?.results || res.data || [];
      setAddresses(list);
      // auto-select default if none selected
      if (!selected) {
        const def = list.find((x: Address) => x.is_default) || list[0] || null;
        setSelected(def);
        onAddressChange?.(def);
        if (def && onSelectedAdvance) onSelectedAdvance();
      }
    } catch (err) {
      console.error("Failed to fetch addresses", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (externalSelected) {
      setSelected(externalSelected);
    }
  }, [externalSelected]);

  const handleSelect = (addr: Address) => {
    if (disableChange) return;
    setSelected(addr);
    onAddressChange?.(addr);
    // auto advance if requested
    if (onSelectedAdvance) onSelectedAdvance();
  };

  const handleEdit = (addr: Address) => {
    setEditing(addr);
    setOpenModal(true);
  };

  const handleSaved = (newAddr: any) => {
    // update list and select
    setAddresses((prev) => {
      const idx = prev.findIndex((p) => p.id === newAddr.id);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = newAddr;
        return copy;
      }
      return [newAddr, ...prev];
    });
    setSelected(newAddr);
    onAddressChange?.(newAddr);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <button
          onClick={() => {
            setEditing(null);
            setOpenModal(true);
          }}
          disabled={disableChange}
          className="inline-flex items-center gap-2 px-3 py-1.5 border rounded text-sm hover:bg-gray-50"
        >
          <Plus className="w-4 h-4" /> Add New Address
        </button>
      </div>

      {loading ? (
        <div className="py-8 text-center text-sm text-gray-500">Loading addresses...</div>
      ) : addresses.length === 0 ? (
        <div className="py-8 text-center text-sm text-gray-500">No addresses found. Add one to continue.</div>
      ) : (
        <AddressList
          addresses={addresses}
          selected={selected}
          onSelect={handleSelect}
          onEdit={handleEdit}
          disabled={disableChange}
        />
      )}

      <AddressModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        address={editing}
        customerId={customerId}
        onSaved={(a) => {
          handleSaved(a);
          setOpenModal(false);
        }}
      />
    </div>
  );
}
