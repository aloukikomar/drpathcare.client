// src/components/account/AccountAddresses.tsx
import { useState } from "react";
import { usePaginatedFetch } from "../../hooks/usePaginatedFetch";
import AccountTable from "./AccountTable";
import AddressItem from "../AddressItem";
import AddressModal from "../address/AddressModal";
import { customerApi } from "../../api/axios";
import { useToast } from "../../context/ToastManager";

const AccountAddresses = () => {
  const {
    items: addresses,
    loading,
    error,
    page,
    next,
    count,
    setPage,
    refresh,
  } = usePaginatedFetch("client/addresses/", { page_size: 5 });

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const { showToast } = useToast();

  // --------------------------
  // Handlers
  // --------------------------

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this address?")) return;
    try {
      await customerApi.delete(`client/addresses/${id}/`);
      showToast("Address deleted", "success");
      refresh();
    } catch {
      showToast("Failed to delete", "error");
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await customerApi.patch(`client/addresses/${id}/`, { is_default: true });
      showToast("Set as default", "success");
      refresh();
    } catch {
      showToast("Failed to update", "error");
    }
  };

  return (
    <>
      <AccountTable
        title="Addresses"
        items={addresses}
        loading={loading}
        error={error}
        page={page}
        next={next}
        setPage={setPage}
        count={count}
        showAddButton={true}
        onAdd={() => {
          setEditing(null);
          setModalOpen(true);
        }}
        renderItem={(addr) => (
          <AddressItem
            key={addr.id}
            addr={addr}
            onEdit={() => {
              setEditing(addr);
              setModalOpen(true);
            }}
            onDelete={() => handleDelete(addr.id)}
            onSetDefault={() => handleSetDefault(addr.id)}
          />
        )}
      />

      {/* Modal */}
      <AddressModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        address={editing}
        onSaved={() => {
          setModalOpen(false);
          refresh();
        }}
      />
    </>
  );
};

export default AccountAddresses;
