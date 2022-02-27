import Head from "next/head";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import compassImg from "../public/compass.svg";
import styled, { CompassTheme } from "styled-components";
import Compass from "../components/compass";

const Home = () => {
  return (
    <>
      <Compass targetLat={55.7864419} targetLon={12.5234279} />
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

export default Home;
