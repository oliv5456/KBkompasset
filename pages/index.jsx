import Head from "next/head";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import compassImg from "../public/compass.svg";
import styled, { CompassTheme } from "styled-components";

const Home = () => {
  return (
    <>
      <Compass />
    </>
  );
};

/*
getDirection(lat1, lng1, lat2, lng2) {
	var PI = Math.PI;
	var dTeta = Math.log(Math.tan((lat2/2)+(PI/4))/Math.tan((lat1/2)+(PI/4)));
	var dLon = Math.abs(lng1-lng2);
	var teta = Math.atan2(dLon,dTeta);
	var direction = Math.round((teta * 180 / Math.PI));
	return direction;
}
*/

function Compass() {
  const [errorText, setErrorText] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [orientation, setOrientation] = useState(0);
  const [clicked, setClicked] = useState(false);

  const [alpha, setAlpha] = useState();

  const kbLocationLat = 55.7864419;
  const kbLocationLon = 12.5234279;

  const getLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(positionCallback, errorCallback);
    } else {
      setErrorText("Din browser har ikke geo lokation aktiveret");
    }
  }, []);
  
  const getDirection = useCallback(() => {

    let dTeta = Math.log(Math.tan(kbLocationLat/2)+(Math.PI/4)/Math.tan((latitude/2)+(Math.PI/4)));
    let dLon = Math.abs(longitude - kbLocationLon);
    let teta = Math.atan2(dLon, dTeta);
    let direction = Math.round(teta * 180 / Math.PI);

    return direction;
  }, [latitude, longitude])

  const getDistance = useMemo(() => {
    let lat1 = (latitude * Math.PI) / 180;
    let lon1 = (longitude * Math.PI) / 180;
    let kbLat = (kbLocationLat * Math.PI) / 180;
    let kbLon = (kbLocationLon * Math.PI) / 180;

    let distLat = lat1 - kbLat;
    let distLon = lon1 - kbLon;

    let a =
      Math.pow(Math.sin(distLat / 2), 2) +
      Math.cos(lat1) * Math.cos(kbLat) * Math.pow(Math.sin(distLon / 2), 2);

    let c = 2 * Math.asin(Math.sqrt(a));
    //calculate to m
    let radius = 3956;

    return c * radius * 1000;
  }, [latitude, longitude]);

  function positionCallback(position) {
    const posLat = position.coords.latitude;
    const posLong = position.coords.longitude;

    setLatitude(posLat);
    setLongitude(posLong);
    setErrorText("");
  }

  function errorCallback(positionError) {
    setErrorText(positionError.message);
  }

  const handleOrientation = useCallback((event) => {
    if (event.webkitCompassHeading) {
      setAlpha(event.webkitCompassHeading);
      setOrientation(getDirection());
    } else {
      setAlpha(event.alpha);
    }
  }, [getDirection]);

  function handleClick() {
    getLocation();
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceMotionEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation, true);
          }
        })
        .catch(console.error) 
    } else {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    setClicked(true);
  }

  useEffect(() => {
    if (clicked) {
      getDirection();
      getDistance;
      getLocation();
      handleOrientation();
    }
  }, [clicked, getDirection, getDistance, getLocation, handleOrientation])

  return (
    <>
      <p>{errorText}</p>
      <button onClick={handleClick}>Start kompas</button>
      <h1>
        Lat: {latitude} Long: {longitude}
      </h1>

      <h1>Distance: {getDistance} meter</h1>
      <h1>Orientation {orientation} deg</h1>

      <h1>
        Kælder Baren: {kbLocationLat}, {kbLocationLon}
      </h1>

      <div
        style={{
          display: "flex",
          position: "absolute",
          justifyContent: "center",
          alignContent: "center",
          transform: `rotate(${orientation}deg)`,
          transformOrigin: "center",
        }}
      >
        <Image src={compassImg} alt="Compass"></Image>
      </div>
    </>
  );
}

export default Home;
