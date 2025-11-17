
import AddressCard from "./AddressCard";
import type { Address } from "./AddressCard";

interface Props {
  addresses: Address[];
  selected?: Address | null;
  disabled?: boolean;
  onSelect?: (a: Address) => void;
  onEdit?: (a: Address) => void;
}

export default function AddressList({ addresses, selected, disabled, onSelect, onEdit }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {addresses.map((a) => (
        <AddressCard
          key={a.id}
          address={a}
          selected={selected?.id === a.id}
          disabled={disabled}
          onClick={onSelect}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
