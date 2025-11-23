import { X, Download, User, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

const DocumentListModal = ({ open, onClose, documents }) => {
  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-xl w-[92%] sm:w-[420px] p-5 max-h-[80vh] overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          {/* HEADER */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Documents</h2>
            <button onClick={onClose}>
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {documents.length === 0 && (
            <div className="text-sm text-gray-500 text-center py-4">
              No documents uploaded yet.
            </div>
          )}

          {documents.map((d) => (
            <div key={d.id} className="p-3 mb-3 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-gray-900">
                  {d.name}
                </div>

                <a
                  href={d.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded hover:bg-gray-100"
                >
                  <Download size={18} className="text-primary" />
                </a>
              </div>

              <div className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                {d.doc_type?.toUpperCase()}
              </div>

              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  {d.created_at ? format(new Date(d.created_at), "dd MMM yyyy") : "—"}
                </div>

                <div className="flex items-center gap-1">
                  <User size={14} />
                  {d.uploaded_by_name || "System"}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DocumentListModal;
