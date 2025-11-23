import { usePaginatedFetch } from "../../hooks/usePaginatedFetch";
import AccountTable from "./AccountTable";
import PaymentItem from "../PaymentItem";

const PaymentsSection = () => {
  const {
    items: payments,
    loading,
    error,
    page,
    count,
    next,
    setPage,
  } = usePaginatedFetch("client/payments/", { page_size: 5 });

  return (
    <AccountTable
      title="Payments"
      items={payments}
      loading={loading}
      error={error}
      page={page}
      next={next}
      setPage={setPage}
      count={count}
      showAddButton={false}
      renderItem={(p) => <PaymentItem key={p.id} p={p} />}
    />
  );
};

export default PaymentsSection;
