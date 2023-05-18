import { useEffect, useState } from "react";
import { db } from "../firebase";
import "./Reservations.scss";

const ReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [editingReservation, setEditingReservation] = useState(null);
  const [editedData, setEditedData] = useState({
    fullName: "",
    hour: "",
    persons: "",
    phoneNumber: "",
    restaurant: "",
    rewards: 0,
  });

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

  const handleEditReservation = (reservation) => {
    setEditingReservation(reservation.id);
    setEditedData({
      fullName: reservation.fullName,
      hour: reservation.hour,
      persons: reservation.persons,
      phoneNumber: reservation.phoneNumber,
      restaurant: reservation.restaurant,
      rewards: reservation.rewards,
    });
  };

  const handleInputChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = async () => {
    try {
      const { fullName, hour, persons, phoneNumber } = editedData;

      await db.collection("reservations").doc(editingReservation).update({
        fullName,
        hour,
        persons,
        phoneNumber,
      });

      setReservations((prevReservations) =>
        prevReservations.map((reservation) =>
          reservation.id === editingReservation
            ? { ...reservation, fullName, hour, persons, phoneNumber }
            : reservation
        )
      );

      setEditingReservation(null);
      setEditedData({
        fullName: "",
        hour: "",
        persons: "",
        phoneNumber: "",
        restaurant: "",
        rewards: 0,
      });

      console.log("Reservation updated successfully!");
    } catch (error) {
      console.error("Error updating reservation:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingReservation(null);
    setEditedData({
      fullName: "",
      hour: "",
      persons: "",
      phoneNumber: "",
      restaurant: "",
      rewards: 0,
    });
  };

  return (
    <div className="reservations-page">
      <h1 className="reservations-page__title">Reservations</h1>
      {reservations.length === 0 ? (
        <p className="reservations-page__empty">No reservations found.</p>
      ) : (
        <ul className="reservations-page__list">
          {reservations.map((reservation) => (
            <li key={reservation.id} className="reservations-page__item">
              {editingReservation === reservation.id ? (
                <>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={editedData.fullName}
                    onChange={handleInputChange}
                    className="reservations-page__input"
                  />
                  <input
                    type="text"
                    name="hour"
                    placeholder="Hour"
                    value={editedData.hour}
                    onChange={handleInputChange}
                    className="reservations-page__input"
                  />
                  <input
                    type="text"
                    name="persons"
                    placeholder="Persons"
                    value={editedData.persons}
                    onChange={handleInputChange}
                    className="reservations-page__input"
                  />
                  <p className="reservations-page__phone">
                    Phone Number: {reservation.phoneNumber}
                  </p>
                  <button
                    onClick={handleSaveEdit}
                    className="reservations-page__button"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="reservations-page__button"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <p className="reservations-page__id">
                    Reservation ID: {reservation.id}
                  </p>
                  <p className="reservations-page__name">
                    Full Name: {reservation.fullName}
                  </p>
                  <p className="reservations-page__hour">
                    Hour: {reservation.hour}
                  </p>
                  <p className="reservations-page__persons">
                    Persons: {reservation.persons}
                  </p>
                  <p className="reservations-page__phone">
                    Phone Number: {reservation.phoneNumber}
                  </p>
                  <p className="reservations-page__rewards">
                    Rewards: {reservation.rewards}
                  </p>
                  <button
                    onClick={() => handleDeleteReservation(reservation.id)}
                    className="reservations-page__button"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleEditReservation(reservation)}
                    className="reservations-page__button"
                  >
                    Edit
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReservationsPage;
