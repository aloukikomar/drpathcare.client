import React from "react";
import { User, Pencil, Trash2, Heart } from "lucide-react";

const PatientItem: React.FC<{
  patient: any;
  onEdit?: () => void;
  onDelete?: () => void;
  onSetDefault?: () => void;
}> = ({ patient, onEdit, onDelete, onSetDefault }) => {

  const initials = `${patient.first_name?.[0] ?? ""}${patient.last_name?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="p-4 border rounded-xl bg-white shadow-sm hover:shadow-md transition">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

        {/* LEFT */}
        <div className="flex items-start gap-3 flex-1 min-w-0">

          {/* Avatar */}
          <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-base shrink-0">
            {initials || <User size={18} />}
          </div>

          {/* Text */}
          <div className="min-w-0">
            <div className="font-semibold text-gray-900 truncate">
              {patient.first_name} {patient.last_name}
            </div>

            <div className="text-sm text-gray-600 mt-0.5 break-all">
              {patient.gender || "—"}
              {patient.age ? ` • ${patient.age}` : ""}
              {patient.alt_mobile ? ` • ${patient.alt_mobile}` : ""}
            </div>

            {patient.is_default && (
              <div className="mt-2 inline-flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full text-xs">
                <Heart size={12} className="fill-primary text-primary" />
                Default Patient
              </div>
            )}
          </div>

        </div>

        {/* RIGHT BUTTONS */}
        <div className="flex sm:flex-col items-center sm:items-end gap-2">

          <button
            onClick={onEdit}
            className="p-2 rounded-lg border text-gray-600 hover:bg-gray-50 hover:text-primary transition flex items-center justify-center"
          >
            <Pencil size={16} />
          </button>

          <button
            onClick={onDelete}
            className="p-2 rounded-lg border text-gray-600 hover:bg-gray-50 hover:text-red-600 transition flex items-center justify-center"
          >
            <Trash2 size={16} />
          </button>

          {!patient.is_default && onSetDefault && (
            <button
              onClick={onSetDefault}
              className="p-2 rounded-lg border text-gray-600 hover:bg-gray-50 hover:text-primary transition flex items-center justify-center"
            >
              <Heart size={16} />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default PatientItem;
