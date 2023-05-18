"use client";
import NavBar from "../../components/NavBar";
import "./id.scss";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import axios from "axios";
import { db } from "../../firebase";
import "react-responsive-carousel/lib/styles/carousel.min.css";

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
    restaurantData && restaurantData.rewards ? restaurantData.rewards : 0;

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
    <>
      <div className="restaurant-details">
        <h1 className="restaurant-details__name">{name}</h1>
        {photos && (
          <div className="restaurant-details__photos">
            <Carousel showStatus={false} showThumbs={false}>
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
        <div className="restaurant-details__info">
          <p className="restaurant-details__price-level">
            Price Level: {price_level}
          </p>
          <p className="restaurant-details__rating">Rating: {rating}</p>
        </div>
        <div className="restaurant-details__opening-hours">
          <h2 className="restaurant-details__section-title">Opening Hours</h2>
          <ul>
            {opening_hours.weekday_text.map((day, index) => (
              <li key={index}>{day}</li>
            ))}
          </ul>
        </div>
        <div className="restaurant-details__address">
          <h2 className="restaurant-details__section-title">Address</h2>
          <p>{formatted_address}</p>
          <p>Phone: {formatted_phone_number}</p>
          <p>Website: {website}</p>
        </div>
        <div className="restaurant-details__reviews reviews">
          <h2 className="restaurant-details__section-title">Reviews</h2>
          {reviews &&
            reviews.map((review, index) => (
              <div className="reviews__review-card review-card" key={index}>
                <h3 className="review-card__author">{review.author_name}</h3>
                <img
                  src={review.profile_photo_url}
                  alt={`Photo of ${review.author_name}`}
                  className="review-card__author-photo"
                />
                <p className="review-card__rating">Rating: {review.rating}</p>
                <p className="review-card__text">{review.text}</p>
              </div>
            ))}
        </div>
        <button
          className="restaurant-details__reservation-button reservation-button"
          onClick={openReservationForm}
        >
          Make Reservation
        </button>
        {showReservationForm && (
          <div className="restaurant-details__reservation-form card-content">
            <h3 className="restaurant-details__section-title">Reservation</h3>
            <form onSubmit={handleSubmit}>
              <div className="restaurant-details__form-row">
                <select name="days" className="restaurant-details__form-select">
                  <option value="day-select">Select Day</option>
                  <option value="sunday">Sunday</option>
                  <option value="monday">Monday</option>
                  <option value="tuesday">Tuesday</option>
                  <option value="wednesday">Wednesday</option>
                  <option value="thursday">Thursday</option>
                  <option value="friday">Friday</option>
                  <option value="saturday">Saturday</option>
                </select>
                <select
                  name="hours"
                  className="restaurant-details__form-select"
                >
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
              <div className="restaurant-details__form-row">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  required
                  className="restaurant-details__form-input"
                />
                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  required
                  className="restaurant-details__form-input"
                />
              </div>
              <div className="restaurant-details__form-row">
                <input
                  type="number"
                  name="persons"
                  placeholder="Number of Persons"
                  required
                  className="restaurant-details__form-input"
                />
              </div>
              <div className="restaurant-details__form-row">
                <input
                  type="submit"
                  value="Make Reservation"
                  className="restaurant-details__form-submit"
                />
              </div>
            </form>
          </div>
        )}
      </div>
      <NavBar />
    </>
  );
};

export default RestaurantDetailsPage;
