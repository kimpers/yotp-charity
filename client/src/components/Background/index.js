import React, { useState } from "react";
import styled from "styled-components";
import { times, once, all, isNil } from "ramda";
import { Text } from "rimble-ui";

import { ReactComponent as FlagSvg } from "./Flag.svg";
import { ReactComponent as AngelPigSvg } from "./AngelPig.svg";
import { ReactComponent as BalloonPigSvg } from "./BalloonPig.svg";
import { ReactComponent as RocketPigSvg } from "./RocketPig.svg";
import { ReactComponent as LogoSvg } from "./PigiveLogo.svg";
import { ReactComponent as MoonFooterSlopeSvg } from "./MoonFooterSlope.svg";

import planetPath from "./planet.png";
import { device } from "../../constants";

const DEFAULT_MESSAGE =
  "It's the year of the pig and we want to celebrate that by helping those in need.\nBy donating to a charity of your liking, you will receive a limited edition ERC720 collectible as a thank you.\nMake the world a better place, one pig at a time.";

const Planet = styled.img`
  width: 150px;
  height: 150px;
  align-self: flex-end;
  z-index: 1;

  @media ${device.mobile} {
    display: none;
  }
`;

const RandomStars = once(() => {
  const prevTop = [];
  const prevLeft = [];

  // Generate random positions for each star but make sure
  // to never put a new star too close to an existing star
  const getUniqueRandom = (prevValues, multiplier, addition = 0) => {
    let tries = 0;
    while (true) {
      const current = Math.floor(Math.random() * multiplier) + addition;

      if (all(v => Math.abs(v - current) >= 5, prevValues) || tries > 10) {
        prevValues.push(current);
        return current;
      }

      tries++;
    }
  };

  // TODO: add twinkling effect
  const GenerateStar = i => {
    const top = getUniqueRandom(prevTop, 50, 5);
    const left = getUniqueRandom(prevLeft, 90, 5);
    const size = Math.floor(Math.random() * 10) + 10;
    const opacity = Math.min(Math.random() + 0.2, 0.7);

    return (
      <div
        key={`star-${i}`}
        style={{
          top: `${top}%`,
          left: `${left}%`,
          width: `${size}px`,
          height: `${size}px`,
          opacity: `${opacity}`,
          background: "#fff",
          borderRadius: "50%",
          position: "absolute",
          zIndex: 0
        }}
      />
    );
  };

  const numStars = window.innerWidth >= 1024 ? 8 : 5;

  return times(GenerateStar, numStars);
});

const SpacePigContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const Space = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(#01110a, #01110ab8);
`;

const SpaceArea = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  margin: 30px;
  min-height: 450px;
`;

const Flag = styled(FlagSvg)`
  height: 200px
  width: 200px;
  transform: rotate(10deg);
  position: absolute;
  right: 0;
  top: -100px;
  z-index: 1;

  /* Hack to position flag on very wide screens */
  @media (min-width: 1200px) {
    top: -200px;
    height: 400px;
    width: 400px;
  }

  @media (min-width: 2500px) {
    top: -120px;
  }

  @media ${device.mobile} {
    display: none;
  }
`;

const MoonArea = styled.div`
  width: 100%;
  max-height: 420px;
  position: relative;
`;

const MoonContentArea = styled.div`
  position: absolute;
  width: 100%;
  @media ${device.mobile} {
    background-color: #fff8f0;
  }
`;

const MessageText = styled(Text)`
  color: #ffd700;
  align-self: center;
  width: 300px;
  margin-left: 15px;
  -webkit-font-smoothing: antialiased;
  font-weight: bold;
  z-index: 1;
`;

const FooterContentWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  overflow: hidden;
  height: 130px;

  @media ${device.mobile} {
    display: none;
  }
`;

const Footer = () => (
  <FooterContentWrapper>
    <LogoSvg
      style={{
        height: "30px",
        width: "130px",
        position: "absolute",
        left: "10px",
        bottom: "8px"
      }}
    />
    <MoonFooterSlopeSvg style={{ height: "140px", width: "300px" }} />
  </FooterContentWrapper>
);

const PigForDonation = ({ donationLevel }) => {
  switch (donationLevel) {
    case "Gold":
      return (
        <RocketPigSvg style={{ width: "250px", height: "250px", zIndex: 1 }} />
      );
    case "Silver":
      return (
        <AngelPigSvg style={{ width: "250px", height: "250px", zIndex: 1 }} />
      );
    default:
      return (
        <BalloonPigSvg style={{ width: "250px", height: "250px", zIndex: 1 }} />
      );
  }
};

const Background = ({ children }) => {
  const [donationLevel, setDonationLevel] = useState("Bronze");
  const [message, setMessage] = useState();

  const displayMessage = isNil(message) ? DEFAULT_MESSAGE : message;

  return (
    <Space>
      <SpaceArea>
        <Planet src={planetPath} />
        <RandomStars />
        <SpacePigContainer>
          <PigForDonation donationLevel={donationLevel} />
          <MessageText>
            {displayMessage.split("\n").map((m, i) => (
              <p key={`message-${i}`}>{m}</p>
            ))}
          </MessageText>
        </SpacePigContainer>
      </SpaceArea>
      <MoonArea>
        <MoonContentArea>
          {React.Children.map(children, child =>
            React.cloneElement(child, {
              donationLevel,
              setDonationLevel,
              message,
              setMessage
            })
          )}
        </MoonContentArea>
        <Moon />
        <Flag />
        <Footer />
      </MoonArea>
    </Space>
  );
};

const Moon = () => (
  <div style={{ maxHeight: "420px", overflow: "hidden" }}>
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 -34.706 1920 1534.706"
      enableBackground="new 0 -34.706 1920 1534.706"
      xmlSpace="preserve"
      style={{
        width: "100%",
        height: "100%"
      }}
    >
      <g id="Layer_2">
        <path
          fill="#FFF8F0"
          d="M1760.02,386.675c0-64.372,52.186-116.554,116.553-116.554c15.352,0,30.006,2.975,43.428,8.367v-5.846
  h0.002v-162.87C1771.174,25.246,1397.48-34.706,960.001-34.706c-437.481,0-811.171,59.95-960,144.477v81.437v81.435v440.543
  c0-56.389,45.711-102.099,102.1-102.099c56.387,0,102.098,45.71,102.098,102.099c0,56.388-45.711,102.101-102.098,102.101
  C45.711,815.286,0,769.573,0,713.186v139.627v661.607h1920V494.858c-13.422,5.393-28.078,8.367-43.428,8.367
  C1812.205,503.226,1760.02,451.042,1760.02,386.675z M204.198,1317.006c-33.354,0-60.393-27.039-60.393-60.392
  c0-33.355,27.039-60.393,60.393-60.393c33.353,0,60.393,27.038,60.393,60.393C264.591,1289.967,237.551,1317.006,204.198,1317.006z
   M322.128,488.578c-71.855,0-130.103-58.248-130.103-130.102s58.248-130.102,130.103-130.102
  c71.853,0,130.102,58.248,130.102,130.102C452.229,430.329,393.981,488.578,322.128,488.578z M838.612,330.514
  c-33.354,0-60.393-27.037-60.393-60.393c0-33.354,27.039-60.393,60.393-60.393c33.353,0,60.393,27.038,60.393,60.393
  C899.005,303.477,871.965,330.514,838.612,330.514z M1368.459,479.259c-33.352,0-60.393-27.037-60.393-60.391
  c0-33.354,27.041-60.393,60.393-60.393c33.355,0,60.393,27.039,60.393,60.393C1428.852,452.221,1401.813,479.259,1368.459,479.259z
   M1648.521,877.604c-90.805,0-164.418-73.611-164.418-164.416c0-90.806,73.613-164.416,164.418-164.416
  c90.803,0,164.416,73.61,164.416,164.416C1812.938,803.99,1739.324,877.604,1648.521,877.604z"
        />
        <circle fill="#C8BBB3" cx="322.128" cy="358.475" r="130.103" />
        <circle fill="#C8BBB3" cx="102.1" cy="713.187" r="102.1" />
        <circle fill="#C8BBB3" cx="838.612" cy="270.121" r="60.393" />
        <circle fill="#C8BBB3" cx="204.198" cy="1256.614" r="60.393" />
        <circle fill="#C8BBB3" cx="1368.459" cy="418.866" r="60.393" />
        <circle fill="#C8BBB3" cx="1648.521" cy="713.186" r="164.415" />
        <path
          fill="#C8BBB3"
          d="M1876.572,270.121c-64.369,0-116.553,52.181-116.553,116.554c0,64.367,52.186,116.551,116.553,116.551
  c15.352,0,30.006-2.974,43.428-8.367V278.489C1906.578,273.096,1891.924,270.121,1876.572,270.121z"
        />
      </g>
    </svg>
  </div>
);

export default Background;
