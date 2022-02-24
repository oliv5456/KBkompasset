import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import compassImg from "../public/compass.svg";
import styled, { CompassTheme } from "styled-components";

const Home: NextPage = () => {
  return (
    <>
      <Compass />
    </>
  );
};

function Compass() {
  const [errorText, setErrorText] = useState<String>("");
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);

  const [absolute, setAbsolute] = useState<boolean>();
  const [alpha, setAlpha] = useState<number | null>();
  const [beta, setBeta] = useState<number | null>();
  const [gamma, setGamma] = useState<number | null>();

  const kbLocationLat = 55.7864419;
  const kbLocationLon = 12.5234279;

  const getLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(positionCallback, errorCallback);
    } else {
      setErrorText("Din browser har ikke geo lokation aktiveret");
    }
  }, []);

  const getDistance = useMemo(() => {
    let lat1: number = (latitude * Math.PI) / 180;
    let lon1: number = (longitude * Math.PI) / 180;
    let kbLat: number = (kbLocationLat * Math.PI) / 180;
    let kbLon: number = (kbLocationLon * Math.PI) / 180;

    let distLat: number = lat1 - kbLat;
    let distLon: number = lon1 - kbLon;

    let a =
      Math.pow(Math.sin(distLat / 2), 2) +
      Math.cos(lat1) * Math.cos(kbLat) * Math.pow(Math.sin(distLon / 2), 2);

    let c = 2 * Math.asin(Math.sqrt(a));
    //calculate to m
    let radius = 3956;

    return c * radius * 1000;
  }, [latitude, longitude]);

  const getHeading = useMemo(() => {
    let directionX = Math.sin(longitude - latitude);
    let directionY = Math.sin(kbLocationLon - kbLocationLat);

    return Math.atan2(directionX, directionY);
  }, [latitude, longitude]);

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

  function handleOrientation(event: DeviceOrientationEvent) {
    setAbsolute(event.absolute);
    if (event.webkitCompassHeading) {
      setAlpha(event.webkitCompassHeading);
    } else {
      setAlpha(event.alpha);
    }
    setBeta(event.beta);
    setGamma(event.gamma);

    event.webkitCompassHeadning;
  }

  useEffect(() => {
    window.addEventListener("deviceorientation", handleOrientation, true);
    getLocation();
  }, [getLocation]);

  return (
    <>
      <p>{errorText}</p>
      <button onClick={getLocation}>Start kompas</button>
      <h1>
        Lat: {latitude} Long: {longitude}
      </h1>

      <h1>Distance: {getDistance} meter</h1>
      <h1>Orientation {alpha}</h1>

      <h1>
        Kælder Baren: {kbLocationLat}, {kbLocationLon}
      </h1>

      <div
        style={{
          display: "flex",
          position: "absolute",
          justifyContent: "center",
          alignContent: "center",
          transform: `rotate(${alpha}deg)`,
          transformOrigin: "center",
        }}
      >
        <Image src={compassImg} alt="Compass"></Image>
      </div>
    </>
  );
}

export default Home;
