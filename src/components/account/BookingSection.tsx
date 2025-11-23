import { usePaginatedFetch } from "../../hooks/usePaginatedFetch";
import AccountTable from "./AccountTable";
import BookingItem from "../BookingItem";

const BookingsSection = () => {
  const {
    items: bookings,
    loading,
    error,
    page,
    count,
    next,
    setPage,
  } = usePaginatedFetch("client/bookings/", { page_size: 5 });

  return (
    <AccountTable
      title="Bookings"
      items={bookings}
      loading={loading}
      error={error}
      page={page}
      next={next}
      setPage={setPage}
      count={count}
      renderItem={(b) => <BookingItem key={b.id} b={b} />}
    />
  );
};

export default BookingsSection;
