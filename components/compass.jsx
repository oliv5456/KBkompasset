import Image from "next/image";
import { useState, useMemo, useCallback, useEffect } from "react";
import compassImg from "../public/compass.svg";

export default function Compass({ targetLat, targetLon }) {
  const [errorText, setErrorText] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [orientation, setOrientation] = useState(0);
  const [direction, setDirection] = useState(0);
  const [distance, setDistance] = useState(0);
  const [clicked, setClicked] = useState(false);

  const [alpha, setAlpha] = useState();

  const getLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(positionCallback, errorCallback);
    } else {
      setErrorText("Din browser har ikke geo lokation aktiveret");
    }
  }, []);

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

  const getDirection = useCallback(() => {
    let dTeta = Math.log(
      Math.tan(targetLat / 2) +
        Math.PI / 4 / Math.tan(latitude / 2 + Math.PI / 4)
    );
    let dLon = Math.abs(longitude - targetLon);
    let teta = Math.atan2(dLon, dTeta);
    let direction = Math.round((teta * 180) / Math.PI);

    setDirection(direction);
    setOrientation(direction - alpha);
  }, [latitude, longitude, targetLat, targetLon, alpha]);

  const getDistance = useMemo(() => {
    let lat1 = (latitude * Math.PI) / 180;
    let lon1 = (longitude * Math.PI) / 180;
    let kbLat = (targetLat * Math.PI) / 180;
    let kbLon = (targetLon * Math.PI) / 180;

    let distLat = lat1 - kbLat;
    let distLon = lon1 - kbLon;

    let a =
      Math.pow(Math.sin(distLat / 2), 2) +
      Math.cos(lat1) * Math.cos(kbLat) * Math.pow(Math.sin(distLon / 2), 2);

    let c = 2 * Math.asin(Math.sqrt(a));
    //calculate to m
    let radius = 3956;
    return setDistance(c * radius * 1000);
  }, [latitude, longitude, targetLat, targetLon]);

  function handleClick() {
    if (typeof DeviceOrientationEvent.requestPermission === "function") {
      DeviceMotionEvent.requestPermission()
        .then((permissionState) => {
          if (permissionState === "granted") {
            window.addEventListener(
              "deviceorientation",
              handleOrientation,
              true
            );
          }
        })
        .catch(console.error);
    } else {
      window.addEventListener("deviceorientation", handleOrientation, true);
    }

    setClicked(true);
  }

  function handleOrientation(event) {
    if (event.webkitCompassHeading) {
      setAlpha(event.webkitCompassHeading);
    } else {
      setAlpha(event.alpha);
    }
  }

  useEffect(() => {
    if (clicked) {
      getDirection();
      getLocation();
      getDistance;
      orientation;
    }
  }, [clicked, getLocation, getDistance, getDirection, orientation]);

  return (
    <>
      <p>{errorText}</p>
      <h1>
        Lat: {latitude} Long: {longitude}
      </h1>

      <h1>Distance: {distance} meter</h1>
      <h1>Orientation {orientation} deg</h1>

      <h1>
        Kælder Baren: {targetLat}, {targetLon}
      </h1>

      <button onClick={handleClick}>Start kompas</button>
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
