import { useEffect, useState } from "react";
import { db } from "../firebase";

const ReservationsPage = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const snapshot = await db.collection("reservations").get();
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReservations(data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    fetchReservations();
  }, []);

  const handleDeleteReservation = async (reservationId) => {
    try {
      await db.collection("reservations").doc(reservationId).delete();
      setReservations((prevReservations) =>
        prevReservations.filter(
          (reservation) => reservation.id !== reservationId
        )
      );
      console.log("Reservation deleted successfully!");
    } catch (error) {
      console.error("Error deleting reservation:", error);
    }
  };

  return (
    <div>
      <h1>Reservations</h1>
      {reservations.length === 0 ? (
        <p>No reservations found.</p>
      ) : (
        <ul>
          {reservations.map((reservation) => (
            <li key={reservation.id}>
              <p>Reservation ID: {reservation.id}</p>
              <p>Guest Name: {reservation.guestName}</p>
              <button onClick={() => handleDeleteReservation(reservation.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReservationsPage;
