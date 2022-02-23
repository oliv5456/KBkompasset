import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

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

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(positionCallback, errorCallback);
    } else {
      setErrorText("Din browser har ikke geo lokation aktiveret");
    }
  }

  function positionCallback(position: GeolocationPosition) {
    const posLat = position.coords.latitude;
    const posLong = position.coords.longitude;

    setLatitude(posLat);
    setLongitude(posLong);
  }

  function errorCallback(positionError: GeolocationPositionError) {
    console.log(positionError);
  }

  useEffect(() => {});

  return (
    <>
      <h1>
        <p>{errorText}</p>
        <button onClick={getLocation}>Get lokation</button>
        Lat: {latitude} Long: {longitude}
      </h1>
    </>
  );
}

export default Home;
