"use client";
import { useState, useEffect, useMemo } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
  OverlayView,
} from "@react-google-maps/api";
import axios from "axios";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import Link from "next/link";

const restaurantsData = [
  {
    name: "Momosan Wynwood",
    place_id: "ChIJI8aonrm32YgRNQ2cXg9k_fk",
    cuisine: "Japanese",
    points: 10,
  },
  {
    name: "Cerveceria La Tropical",
    place_id: "ChIJX772nXW32YgRqL-0pvjFPYY",
    cuisine: "Cuban",
    points: 6,
  },
  {
    name: "R House Wynwood",
    place_id: "ChIJqefzYK222YgRNDCblbPPVVU",
    cuisine: "Contemporary Latin",
    points: 4,
  },
  {
    name: "La Tiendita Taqueria",
    place_id: "ChIJ95niEx632YgRzw1w0z6Ioyc",
    cuisine: "Mexican",
    points: 16,
  },
  {
    name: "STK Steakhouse",
    place_id: "ChIJaXDYCGKz2YgRqb5MFh9gVf0",
    cuisine: "Steakhouse",
    points: 8,
  },
  {
    name: "Amara at Paraiso",
    place_id: "ChIJ7-kC5C6y2YgR8kFGy8pYlsM",
    cuisine: "Contemporary American",
    points: 5,
  },
  {
    name: "Michael's Genuine",
    place_id: "ChIJfRgILlex2YgRvDRFonWLC4w",
    cuisine: "Contemporary American",
    points: 7,
  },
  {
    name: "SUGARCANE raw bar grill",
    place_id: "ChIJMUpdgFOx2YgROjWhMQZMBRk",
    cuisine: "Seafood",
    points: 13,
  },
  {
    name: "Sofia - Design District",
    place_id: "ChIJAQBA3lax2YgRB7AIAB_GK_E",
    cuisine: "Modern European",
    points: 1,
  },
  {
    name: "Moxies Miami Restaurant",
    place_id: "ChIJ4yC24GK32YgRAEsm4jvWV30",
    cuisine: "American",
    points: 4,
  },
  {
    name: "Dolce Italian",
    place_id: "ChIJazj3FJu02YgREmLOfWg0kG8",
    cuisine: "Italian",
    points: 7,
  },
  {
    name: "The River Oyster Bar",
    place_id: "ChIJX7AIlpC22YgR-faru5-AMpM",
    cuisine: "Seafood",
    points: 15,
  },
  {
    name: "Boulud Sud Miami",
    place_id: "ChIJKc4o84ux2YgRwV9hXejE_6w",
    cuisine: "Mediterranean",
    points: 13,
  },
  {
    name: "The Bazaar by José Andrés",
    place_id: "ChIJGV4vnJu02YgRRPZ2RRlUZbQ",
    cuisine: "Spanish",
    points: 20,
  },
  {
    name: "Novecento",
    place_id: "ChIJEWuAKIG22YgRPOEUG7BlFsQ",
    cuisine: "Italian",
    points: 17,
  },
  {
    name: "The Capital Grille",
    place_id: "ChIJKVAQIZ222YgRxqIAgjmhNz8",
    cuisine: "Steakhouse",
    points: 13,
  },
  {
    name: "Motek",
    place_id: "ChIJtQCVt7G32YgR3aHrmstwrrk",
    cuisine: "Mediterranean",
    points: 15,
  },
  {
    name: "Crazy About You",
    place_id: "ChIJ56WSjYG22YgRV8CLvPG3z9E",
    cuisine: "American",
    points: 5,
  },
  {
    name: "Sexy Fish Miami",
    place_id: "ChIJdfkR4PC32YgRgxEP4swq1oY",
    cuisine: "Asian fusion",
    points: 16,
  },
  {
    name: "Dalia",
    place_id: "ChIJa1junq-12YgRqZ1aHTFcywE",
    cuisine: "Mediterranean",
    points: 10,
  },
  {
    name: "Tequiztlan",
    place_id: "ChIJtcEOCX602YgRQnCABa-D1gc",
    cuisine: "Mexican",
    points: 3,
  },
  {
    name: "Playa Miami",
    place_id: "ChIJFblNZYa02YgR1QY7Ux8Ki7w",
    cuisine: "Mediterranean",
    points: 2,
  },
];

const Home = () => {
  const [selected, setSelected] = useState(null);
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      const results = await Promise.all(
        restaurantsData.map((restaurant) =>
          axios.get(`/api/placeDetails?place_id=${restaurant.place_id}`)
        )
      );
      console.log(results);
      const data = results.map((result) => result.data.result);
      setRestaurants(data);
    };

    fetchRestaurantData();
  }, []);

  const options = useMemo(
    () => ({
      mapId: "a34ef3cb7aa15eda",
      disableDefaultUI: true,
      clickableIcons: false,
    }),
    []
  );

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  if (!isLoaded) return <div>Loading...</div>;

  const getPixelPositionOffset = (width, height) => ({
    x: -(width / 2),
    y: -(height / 2),
  });

  return (
    <div>
      <GoogleMap
        zoom={12}
        center={{ lat: 25.76, lng: -80.191788 }}
        mapContainerClassName="map-container"
        options={options}
      >
        {restaurants.map((restaurant, i) => (
          <OverlayView
            key={restaurant.place_id}
            position={{
              lat: restaurant.geometry.location.lat,
              lng: restaurant.geometry.location.lng,
            }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            getPixelPositionOffset={getPixelPositionOffset}
          >
            <>
              <div className="marker-label">{restaurant.name}</div>
              <Marker
                position={{
                  lat: restaurant.geometry.location.lat,
                  lng: restaurant.geometry.location.lng,
                }}
                onClick={() => {
                  setSelected(restaurant);
                }}
                icon={{
                  url: `data:image/svg+xml;utf-8, 
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 35">
                <circle cx="17.5" cy="17.5" r="15" fill="%23FF0000"/>
                <text x="50%" y="50%" text-anchor="middle" fill="white" font-size="12px" dy=".3em">
                  ${restaurantsData[i].points}%
                </text>
              </svg>`,
                  scaledSize: new window.google.maps.Size(35, 35),
                }}
              />
            </>
          </OverlayView>
        ))}
        {selected && (
          <Link href={`/restaurants/${selected.place_id}`} passHref>
            <InfoWindow
              position={{
                lat: selected.geometry.location.lat,
                lng: selected.geometry.location.lng,
              }}
              onCloseClick={() => {
                setSelected(null);
              }}
            >
              <div>
                <h2>{selected.name}</h2>
                <p>Price level: {selected.price_level}</p>
                <p>Rating: {selected.rating}</p>
                <Carousel>
                  {selected.photos?.map((photo, index) => (
                    <div key={index}>
                      <img
                        src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
                        alt="Restaurant"
                      />
                    </div>
                  ))}
                </Carousel>
              </div>
            </InfoWindow>
          </Link>
        )}
      </GoogleMap>
    </div>
  );
};

export default Home;
