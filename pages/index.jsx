import Head from "next/head";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import compassImg from "../public/compass.svg";
import styled, { CompassTheme } from "styled-components";
import Compass from "../components/compass";
import { BrowserView, MobileOnlyView } from "react-device-detect";
import { Container, Row, Col } from "react-bootstrap";


const Home = () => {
  return (
    <>
	<BrowserView>
		<Container fluid className="bg-danger vh-100 m-auto d-flex justify-content-center align-items-center">
			<Row>
				<Col md={2}></Col>
				<Col md={8} className="text-center">
					<div>
						<h1 className="text-center text-white">Du skal bruge iphone eller android for at bruge kompasset :(</h1>
					</div>
				</Col>
				<Col md={2}></Col>
			</Row>
		</Container>
	</BrowserView>
	<MobileOnlyView className="bg-white">
      <Compass targetLat={55.7864419} targetLon={12.5234279} />
	</MobileOnlyView>
    </>
  );
};

export default Home;
