"use client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import axios from "axios";

const RestaurantDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [restaurantData, setRestaurantData] = useState(null);

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
  } = restaurantData;

  return (
    <div>
      <h1>{name}</h1>
      {photos && (
        <div>
          <h2>Photos</h2>
          <Carousel>
            {photos.map((photo, index) => (
              <div key={index}>
                <img src={photo} alt={`Photo ${index + 1}`} />
              </div>
            ))}
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
      {/* Render other restaurant details */}
    </div>
  );
};

export default RestaurantDetailsPage;
