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
  const [latitude, setLatitude] = useState<Number>();
  const [longitude, setLongitude] = useState<Number>();

  function getLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      const posLat = position.coords.latitude;
      const posLong = position.coords.longitude;

      setLatitude(posLat);
      setLongitude(posLong);
    });
  }

  useEffect(() => {
    getLocation();
  });

  return (
    <>
      <h1>
        Lat: {latitude} Long: {longitude}
      </h1>
    </>
  );
}

export default Home;
