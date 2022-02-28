import Head from "next/head";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import compassImg from "../public/compass.svg";
import styled, { CompassTheme } from "styled-components";
import Compass from "../components/compass";
import { BrowserView, MobileOnlyView } from "react-device-detect";
import { Container, Row } from "react-bootstrap";


const Home = () => {
  return (
    <>
	<BrowserView>
		<Container fluid className="bg-danger vh-100">
			<div className="flex-column">
				<h1 className="text-center text-white align-middle">Du skal bruge iphone eller android for at bruge kompasset :(</h1>
			</div>
		</Container>
	</BrowserView>
	<MobileOnlyView>
      <Compass targetLat={55.7864419} targetLon={12.5234279} />
	</MobileOnlyView>
    </>
  );
};

export default Home;
