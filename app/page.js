"use client";
import { v4 as uuidv4 } from "uuid";
import styles from "./page.module.css";
import { useMemo, useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  OverlayView,
} from "@react-google-maps/api";

const restaurants = [
  {
    name: "Le Chick Miami",
    address: "310 NW 24th St, Miami, FL 33127",
    lat: 25.800145,
    lng: -80.199688,
    rating: 4.5,
    priceLevel: 2,
    reward: 10,
  },
  {
    name: "Coyo Taco",
    address: "251 NW 23rd St, Miami, FL 33127",
    lat: 25.800145,
    lng: -80.199688,
    rating: 4.5,
    priceLevel: 2,
    reward: 12,
  },
  {
    name: "Azul Latin Kitchen",
    address: "1300 Biscayne Blvd, Miami, FL 33132",
    lat: 25.788551,
    lng: -80.189014,
    rating: 4.5,
    priceLevel: 3,
    reward: 14,
  },
  {
    name: "Sushi Maki",
    address: "325 NW 23rd St, Miami, FL 33127",
    lat: 25.800266,
    lng: -80.199393,
    rating: 4.5,
    priceLevel: 2,
    reward: 11,
  },
  {
    name: "The Butcher Shop",
    address: "221 NW 23rd St, Miami, FL 33127",
    lat: 25.799971,
    lng: -80.199705,
    rating: 4.5,
    priceLevel: 4,
    reward: 13,
  },
  {
    name: "The Wynwood Yard",
    address: "56 NW 23rd St, Miami, FL 33127",
    lat: 25.799714,
    lng: -80.200355,
    rating: 4.5,
    priceLevel: 2,
    reward: 10,
  },
  {
    name: "Kiki's Chicken & Waffles",
    address: "2901 NW 7th Ave, Miami, FL 33127",
    lat: 25.802593,
    lng: -80.201633,
    rating: 4.5,
    priceLevel: 2,
    reward: 12,
  },
  {
    name: "Sweet Liberty Drinks & Supply Co.",
    address: "260 NW 24th St, Miami, FL 33127",
    lat: 25.800082,
    lng: -80.199344,
    rating: 4.5,
    priceLevel: 2,
    reward: 11,
  },
  {
    name: "The Salty Donut",
    address: "350 NW 23rd St, Miami, FL 33127",
    lat: 25.799622,
    lng: -80.200725,
    rating: 4.5,
    priceLevel: 1,
    reward: 10,
  },
  {
    name: "Michael's Genuine Food & Drink",
    address: "1300 Brickell Ave, Miami, FL 33131",
    lat: 25.760612,
    lng: -80.191223,
    rating: 4.5,
    priceLevel: 4,
    reward: 15,
  },
  {
    name: "Lilia",
    address: "1100 SW 1st Ave, Miami, FL 33130",
    lat: 25.772897,
    lng: -80.195086,
    rating: 4.5,
    priceLevel: 3,
    reward: 14,
  },
  {
    name: "The Bazaar by José Andrés",
    address: "1101 SW 1st Ave, Miami, FL 33130",
    lat: 25.772921,
    lng: -80.195109,
    rating: 4.5,
    priceLevel: 5,
    reward: 13,
  },
  {
    name: "Mignonette",
    address: "1100 SW 1st Ave, Miami, FL 33130",
    lat: 25.772945,
    lng: -80.195132,
    rating: 4.5,
    priceLevel: 4,
    reward: 12,
  },
  {
    name: "O-Ku",
    address: "1100 SW 1st Ave, Miami, FL 33130",
    lat: 25.772969,
    lng: -80.195155,
    rating: 4.5,
    priceLevel: 4,
    reward: 11,
  },
  {
    name: "Ember",
    address: "1100 SW 1st Ave, Miami, FL 33130",
    lat: 25.772993,
    lng: -80.195178,
    rating: 4.5,
    priceLevel: 4,
    reward: 10,
  },
  {
    name: "The River Oyster Bar",
    address: "888 Brickell Ave, Miami, FL 33131",
    lat: 25.772742,
    lng: -80.195022,
    rating: 4.5,
    priceLevel: 3,
    reward: 12,
  },
  {
    name: "The Capital Grille",
    address: "888 Brickell Ave, Miami, FL 33131",
    lat: 25.772766,
    lng: -80.195045,
    rating: 4.5,
    priceLevel: 4,
    reward: 11,
  },
  {
    name: "Novecento",
    address: "888 Brickell Ave, Miami, FL 33131",
    lat: 25.77279,
    lng: -80.195068,
    rating: 4.5,
    priceLevel: 3,
    reward: 10,
  },
  {
    name: "Joe's Stone Crab Restaurant",
    address: "11 Washington Ave, Miami Beach, FL 33139",
    lat: 25.768126,
    lng: -80.193878,
    rating: 4.5,
    priceLevel: 4,
    reward: 15,
  },
  {
    name: "Cafe Prima Pasta",
    address: "1114 Ocean Dr, Miami Beach, FL 33139",
    lat: 25.78217,
    lng: -80.131745,
    rating: 4.5,
    priceLevel: 3,
    reward: 14,
  },
  {
    name: "The Strand at Carillon Miami, The",
    address: "600 Ocean Dr, Miami Beach, FL 33139",
    lat: 25.775752,
    lng: -80.1313,
    rating: 4.5,
    priceLevel: 5,
    reward: 13,
  },
  {
    name: "Estiatorio Milos",
    address: "100 Ocean Dr, Miami Beach, FL 33139",
    lat: 25.770968,
    lng: -80.132853,
    rating: 4.5,
    priceLevel: 4,
    reward: 12,
  },
  {
    name: "27 Restaurant and Bar",
    address: "2727 Collins Ave, Miami Beach, FL 33139",
    lat: 25.808137,
    lng: -80.123723,
    rating: 4.5,
    priceLevel: 4,
    reward: 11,
  },
  {
    name: "StripSteak by Michael Mina",
    address: "400 Ocean Dr, Miami Beach, FL 33139",
    lat: 25.777757,
    lng: -80.132132,
    rating: 4.5,
    priceLevel: 5,
    reward: 10,
  },
  {
    name: "Jaya, at The Setai",
    address: "2001 Collins Ave, Miami Beach, FL 33139",
    lat: 25.791012,
    lng: -80.128416,
    rating: 4.5,
    priceLevel: 5,
    reward: 12,
  },
  {
    name: "Los Fuegos at Faena Miami Beach",
    address: "3201 Collins Ave, Miami Beach, FL 33139",
    lat: 25.80985,
    lng: -80.123079,
    rating: 4.5,
    priceLevel: 4,
    reward: 11,
  },
  {
    name: "Matador Room",
    address: "900 Ocean Dr, Miami Beach, FL 33139",
    lat: 25.7798,
    lng: -80.13192,
    rating: 4.5,
    priceLevel: 4,
    reward: 10,
  },
];

const Home = () => {
  const [selected, setSelected] = useState(null);

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
        {restaurants.map((restaurant) => (
          <OverlayView
            key={uuidv4()}
            position={{ lat: restaurant.lat, lng: restaurant.lng }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            getPixelPositionOffset={getPixelPositionOffset}
          >
            <Marker
              position={{ lat: restaurant.lat, lng: restaurant.lng }}
              onClick={() => {
                setSelected(restaurant);
              }}
            />
          </OverlayView>
        ))}

        {selected ? (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => {
              setSelected(null);
            }}
          >
            <div>
              <h2>{selected.name}</h2>
              <p>{selected.address}</p>
            </div>
          </InfoWindow>
        ) : null}
      </GoogleMap>
    </div>
  );
};

export default Home;
