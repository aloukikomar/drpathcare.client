// src/components/account/AccountPatients.tsx

import React, { useState } from "react";
import { usePaginatedFetch } from "../../hooks/usePaginatedFetch";
import AccountTable from "./AccountTable";
import PatientItem from "../PatientItem";
import PatientModal from "../PatientModal";
import { customerApi } from "../../api/axios";

const AccountPatients: React.FC = () => {
  const {
    items: patients,
    loading,
    error,
    page,
    count,
    next,
    setPage,
    refresh,
  } = usePaginatedFetch("client/patients/", { page_size: 5 });

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const user = JSON.parse(localStorage.getItem("user") || "null")
  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this patient?")) return;
    await customerApi.delete(`client/patients/${id}/`);
    refresh();
  };

  return (
    <>
      <AccountTable
        title="Patients"
        items={patients}
        loading={loading}
        error={error}
        page={page}
        count={count}
        next={next}
        setPage={setPage}
        showAddButton={true}
        // addButtonLabel="Add Patient"
        onAdd={() => {
          setEditing(null);
          setModalOpen(true);
        }}
        renderItem={(p: any) => (
          <PatientItem
            key={p.id}
            patient={p}
            onEdit={() => {
              setEditing(p);
              setModalOpen(true);
            }}
            onDelete={() => handleDelete(p.id)}
          />
        )}
      />

      {/* MODAL */}
      <PatientModal
        customerId={user?.id}
        open={modalOpen}
        editingPatient={editing}
        onClose={() => setModalOpen(false)}
        onSaved={() => {
          setModalOpen(false);
          refresh();
        }}
      />
    </>
  );
};

export default AccountPatients;
