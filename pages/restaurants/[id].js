"use client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import axios from "axios";
import { db } from "../../firebase";

const RestaurantDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [restaurantData, setRestaurantData] = useState(null);
  const [showReservationForm, setShowReservationForm] = useState(false);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const response = await axios.get(`/api/placeDetails?place_id=${id}`);
        if (response.data.result) {
          setRestaurantData(response.data.result);
        }
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
      }
    };

    if (id) {
      fetchRestaurantData();
    }
  }, [id]);

  const rewards =
    restaurantData && restaurantData.points ? restaurantData.points : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = {
      day: form.days.value,
      hour: form.hours.value,
      fullName: form.fullName.value,
      phoneNumber: form.phoneNumber.value,
      persons: form.persons.value,
      restaurant: restaurantData ? restaurantData.name : "",
      rewards: rewards,
    };

    try {
      await db.collection("reservations").add(formData);
      alert("Reservation made successfully");
      setShowReservationForm(false);
    } catch (error) {
      console.error("Error making reservation:", error);
    }
  };

  const openReservationForm = () => {
    setShowReservationForm(true);
  };

  if (!restaurantData) {
    return <div>Loading...</div>;
  }

  const {
    name,
    photos,
    cuisine,
    price_level,
    rating,
    opening_hours,
    formatted_address,
    formatted_phone_number,
    website,
    reviews,
  } = restaurantData;

  return (
    <div>
      <h1>{name}</h1>
      {photos && (
        <div>
          <h2>Photos</h2>
          <Carousel>
            {photos.map((photo, index) => {
              const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
              return (
                <div key={index}>
                  <img src={photoUrl} alt={`Photo ${index + 1}`} />
                </div>
              );
            })}
          </Carousel>
        </div>
      )}
      <h2>Cuisine: {cuisine}</h2>
      <p>Price Level: {price_level}</p>
      <p>Rating: {rating}</p>
      <h2>Opening Hours</h2>
      <ul>
        {opening_hours.weekday_text.map((day, index) => (
          <li key={index}>{day}</li>
        ))}
      </ul>
      <h2>Address: {formatted_address}</h2>
      <p>Phone: {formatted_phone_number}</p>
      <p>Website: {website}</p>
      <h2>Reviews</h2>
      {reviews &&
        reviews.map((review, index) => (
          <div key={index}>
            <h3>{review.author_name}</h3>
            <img
              src={review.profile_photo_url}
              alt={`Photo of ${review.author_name}`}
            />
            <p>Rating</p>
            <p>Rating: {review.rating}</p>
            <p>{review.text}</p>
          </div>
        ))}

      <button onClick={openReservationForm}>Make Reservation</button>

      {showReservationForm && (
        <div className="card-content">
          <h3>Reservation</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <select name="days">
                <option value="day-select">Select Day</option>
                <option value="sunday">Sunday</option>
                <option value="monday">Monday</option>
                <option value="tuesday">Tuesday</option>
                <option value="wednesday">Wednesday</option>
                <option value="thursday">Thursday</option>
                <option value="friday">Friday</option>
                <option value="saturday">Saturday</option>
              </select>

              <select name="hours">
                <option value="hour-select">Select Hour</option>
                <option value="10">10:00</option>
                <option value="12">12:00</option>
                <option value="14">14:00</option>
                <option value="16">16:00</option>
                <option value="18">18:00</option>
                <option value="20">20:00</option>
                <option value="22">22:00</option>
              </select>
            </div>

            <div className="form-row">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                required
              />
              <input
                type="text"
                name="phoneNumber"
                placeholder="Phone Number"
                required
              />
            </div>

            <div className="form-row">
              <input
                type="number"
                name="persons"
                placeholder="Number of Persons"
                required
              />
            </div>

            <div className="form-row">
              <input type="submit" value="Make Reservation" />
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetailsPage;
