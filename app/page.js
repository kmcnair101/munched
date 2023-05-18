"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import NavBar from "../components/NavBar";
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
import SignUpForm from "../components/SignUpForm";
import SignInForm from "../components/SignInForm";
import { auth } from "../firebase";

const restaurantsData = [
  {
    name: "Momosan Wynwood",
    place_id: "ChIJI8aonrm32YgRNQ2cXg9k_fk",
    cuisine: "Japanese",
    rewards: 10,
  },
  {
    name: "Cerveceria La Tropical",
    place_id: "ChIJX772nXW32YgRqL-0pvjFPYY",
    cuisine: "Cuban",
    rewards: 6,
  },
  {
    name: "R House Wynwood",
    place_id: "ChIJqefzYK222YgRNDCblbPPVVU",
    cuisine: "Contemporary Latin",
    rewards: 4,
  },
  {
    name: "La Tiendita Taqueria",
    place_id: "ChIJ95niEx632YgRzw1w0z6Ioyc",
    cuisine: "Mexican",
    rewards: 16,
  },
  {
    name: "STK Steakhouse",
    place_id: "ChIJaXDYCGKz2YgRqb5MFh9gVf0",
    cuisine: "Steakhouse",
    rewards: 8,
  },
  {
    name: "Amara at Paraiso",
    place_id: "ChIJ7-kC5C6y2YgR8kFGy8pYlsM",
    cuisine: "Contemporary American",
    rewards: 5,
  },
  {
    name: "Michael's Genuine",
    place_id: "ChIJfRgILlex2YgRvDRFonWLC4w",
    cuisine: "Contemporary American",
    rewards: 7,
  },
  {
    name: "SUGARCANE raw bar grill",
    place_id: "ChIJMUpdgFOx2YgROjWhMQZMBRk",
    cuisine: "Seafood",
    rewards: 13,
  },
  {
    name: "Sofia - Design District",
    place_id: "ChIJAQBA3lax2YgRB7AIAB_GK_E",
    cuisine: "Modern European",
    rewards: 1,
  },
  {
    name: "Moxies Miami Restaurant",
    place_id: "ChIJ4yC24GK32YgRAEsm4jvWV30",
    cuisine: "American",
    rewards: 4,
  },
  {
    name: "Dolce Italian",
    place_id: "ChIJazj3FJu02YgREmLOfWg0kG8",
    cuisine: "Italian",
    rewards: 7,
  },
  {
    name: "The River Oyster Bar",
    place_id: "ChIJX7AIlpC22YgR-faru5-AMpM",
    cuisine: "Seafood",
    rewards: 15,
  },
  {
    name: "Boulud Sud Miami",
    place_id: "ChIJKc4o84ux2YgRwV9hXejE_6w",
    cuisine: "Mediterranean",
    rewards: 13,
  },
  {
    name: "The Bazaar by José Andrés",
    place_id: "ChIJGV4vnJu02YgRRPZ2RRlUZbQ",
    cuisine: "Spanish",
    rewards: 20,
  },
  {
    name: "Novecento",
    place_id: "ChIJEWuAKIG22YgRPOEUG7BlFsQ",
    cuisine: "Italian",
    rewards: 17,
  },
  {
    name: "The Capital Grille",
    place_id: "ChIJKVAQIZ222YgRxqIAgjmhNz8",
    cuisine: "Steakhouse",
    rewards: 13,
  },
  {
    name: "Motek",
    place_id: "ChIJtQCVt7G32YgR3aHrmstwrrk",
    cuisine: "Mediterranean",
    rewards: 15,
  },
  {
    name: "Crazy About You",
    place_id: "ChIJ56WSjYG22YgRV8CLvPG3z9E",
    cuisine: "American",
    rewards: 5,
  },
  {
    name: "Sexy Fish Miami",
    place_id: "ChIJdfkR4PC32YgRgxEP4swq1oY",
    cuisine: "Asian fusion",
    rewards: 16,
  },
  {
    name: "Dalia",
    place_id: "ChIJa1junq-12YgRqZ1aHTFcywE",
    cuisine: "Mediterranean",
    rewards: 10,
  },
  {
    name: "Tequiztlan",
    place_id: "ChIJtcEOCX602YgRQnCABa-D1gc",
    cuisine: "Mexican",
    rewards: 3,
  },
  {
    name: "Playa Miami",
    place_id: "ChIJFblNZYa02YgR1QY7Ux8Ki7w",
    cuisine: "Mediterranean",
    rewards: 2,
  },
];

const defaultCenter = { lat: 25.76, lng: -80.191788 };
const defaultZoom = 12;

const InfoWindowContent = ({ restaurant }) => (
  <div className="info-window">
    <Carousel className="info-window__carousel" showThumbs={false} infiniteLoop>
      {restaurant.photos?.map((photo, index) => (
        <div key={index}>
          <img
            src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
            alt="Restaurant"
          />
        </div>
      ))}
    </Carousel>
    <h2 className="info-window__title">{restaurant.name}</h2>
    <p className="info-window__info">
      <span>Cuisine:</span> {restaurant.cuisine}
    </p>
    <p className="info-window__info">
      <span>Price Level:</span> {restaurant.price_level}
    </p>
    <p className="info-window__info">
      <span>Rewards:</span> {restaurant.rewards}%
    </p>
  </div>
);

const Home = () => {
  const [selected, setSelected] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [user, setUser] = useState(null);
  const infoWindowRef = useRef(null);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      const results = await Promise.all(
        restaurantsData.map((restaurant) =>
          axios.get(`/api/placeDetails?place_id=${restaurant.place_id}`)
        )
      );
      const data = results.map((result) => result.data.result);
      setRestaurants(data);
    };

    fetchRestaurantData();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
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

  const handleSignUpClick = () => {
    setShowSignUp(true);
  };

  const handleSignInClick = () => {
    setShowSignIn(true);
  };

  const handleSignUpClose = () => {
    setShowSignUp(false);
  };

  const handleSignInClose = () => {
    setShowSignIn(false);
  };

  const getRewardsByPlaceId = (placeId) => {
    const restaurant = restaurantsData.find(
      (restaurant) => restaurant.place_id === placeId
    );
    return restaurant ? `${restaurant.rewards}%` : null;
  };

  const handleInfoWindowClick = (placeId) => {
    window.location.href = `/restaurants/${placeId}`;
  };

  return (
    <>
      <div>
        <GoogleMap
          zoom={defaultZoom}
          center={defaultCenter}
          mapContainerStyle={{
            width: "100%",
            height: "100vh",
          }}
          options={options}
        >
          {restaurants.map((restaurant) => (
            <Marker
              key={restaurant.place_id}
              position={{
                lat: restaurant.geometry.location.lat,
                lng: restaurant.geometry.location.lng,
              }}
              label={String(getRewardsByPlaceId(restaurant.place_id))}
              onClick={() => {
                setSelected(restaurant);
              }}
            >
              {selected === restaurant && (
                <InfoWindow
                  onCloseClick={() => {
                    setSelected(null);
                  }}
                  onLoad={() => {
                    const overlay = infoWindowRef.current;
                    if (overlay) {
                      overlay.parentNode.addEventListener("click", (e) => {
                        e.stopPropagation();
                        handleInfoWindowClick(restaurant.place_id);
                      });
                    }
                  }}
                >
                  <div ref={infoWindowRef}>
                    <InfoWindowContent restaurant={restaurant} />
                  </div>
                </InfoWindow>
              )}
            </Marker>
          ))}
        </GoogleMap>
      </div>
    </>
  );
};

export default Home;
