import React, { useEffect, useState } from "react";
import { customerApi } from "../../api/axios";
import { Loader } from "lucide-react";

const AccountPayments: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);

  const fetchPayments = async () => {
    try {
      const res = await customerApi.get("payments/");
      setPayments(res.results || res);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  if (loading)
    return <div className="text-center py-10"><Loader className="w-6 h-6 animate-spin mx-auto" /></div>;

  if (payments.length === 0)
    return <div className="text-center text-gray-500 py-10">No payments found</div>;

  return (
    <div className="space-y-4">
      {payments.map((p: any) => (
        <div key={p.id} className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex justify-between">
            <div>
              <div className="font-semibold">₹{p.amount}</div>
              <div className="text-sm text-gray-700">Status: {p.status}</div>
              <div className="text-sm text-gray-600 mt-1">
                Method: {p.method || "—"}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AccountPayments;
