import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import compass from "../public/compass.svg";

const Home: NextPage = () => {
  return (
    <>
      <Compass />
      <div>
        <h1>Min side</h1>
      </div>
    </>
  );
};

function Compass() {
  const [errorText, setErrorText] = useState<String>("");
  const [latitude, setLatitude] = useState<Number>();
  const [longitude, setLongitude] = useState<Number>();
  const kbLocation = [55.7864419, 12.5234279];

  const getLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(positionCallback, errorCallback);
    } else {
      setErrorText("Din browser har ikke geo lokation aktiveret");
    }
  }, []);

  function positionCallback(position: GeolocationPosition) {
    const posLat = position.coords.latitude;
    const posLong = position.coords.longitude;

    setLatitude(posLat);
    setLongitude(posLong);
    setErrorText("");
  }

  function errorCallback(positionError: GeolocationPositionError) {
    setErrorText(positionError.message);
  }

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  return (
    <>
      <p>{errorText}</p>
      <button onClick={getLocation}>Get lokation</button>
      <h1>
        Lat: {latitude} Long: {longitude}
      </h1>

      <h1>
        Kælder Baren: {kbLocation[0]}, {kbLocation[1]}
      </h1>
    </>
  );
}

export default Home;
