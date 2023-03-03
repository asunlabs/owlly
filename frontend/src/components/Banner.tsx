import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';

export function TopCreatorBanner() {
  return (
    <div className="landingBanner" id="top">
      <img src="" id="github" alt="github logo" loading="lazy" />
      <span>
        <a href="https://github.com/developerasun" target="_blank" rel="noopener noreferrer">
          @developerasun
        </a>
      </span>
    </div>
  );
}

export function BottomWavyBanner() {
  return (
    <div className="landingBanner" id="bottom">
      <div className="waves"></div>
      <div className="waves"></div>
      <div className="waves"></div>
      <div className="waves"></div>
    </div>
  );
}

/**
 * /* 
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'JetBrainsMono NF';
}

a {
    all: unset;
    cursor: pointer;
}

.landingBanner {
    display: flex;
    background-color: black;
    color: white;
}

.landingBanner:first-child {
    background-color: white;
    color: black;
}

#github {
    width: 50px;
}

#top {
    height: 10vh;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
}

#top > span > a {
    text-decoration: none;
    transform: translateY(20px);
}

#top > span > a:hover {
    font-weight: bold;
}

#middle {
    height: 80vh;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
}

#middle > h1 {
    font-size: 4rem;
    background-image: linear-gradient(
        60deg,
        #40011e,
        #bf34b6,
        #711073,
        #1b4c8c,
        #0f8aa6
    );
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    animation: breath 2.5s ease-in-out infinite;
    margin-bottom: 30px;
}

@keyframes breath {
    0% {
        opacity: 0.2;
        text-shadow: 3px 3px rgb(255, 255, 255);
    }
    100% {
        opacity: 1;
        text-shadow: 6px 6px rgb(255, 255, 255);
    }
}

#bottom {
    height: 10vh;
    flex-direction: column;
    position: relative;
}

#bottom > .waves {
    background-image: url('./wave.png');
    background-repeat: repeat-x;
    width: 100%;
    height: 100%;
    position: absolute;
}

#bottom > .waves:nth-child(1) {
    animation: curve 15s ease-in-out infinite;
    opacity: 0.8;
}

#bottom > .waves:nth-child(2) {
    animation: curve 14s ease-in-out infinite;
    animation-direction: reverse;
    opacity: 0.6;
}

#bottom > .waves:nth-child(3) {
    animation: curve 13s ease-in-out infinite;
    opacity: 0.4;
}

#bottom > .waves:nth-child(4) {
    animation: curve 12s ease-in-out infinite;
    animation-direction: reverse;
    opacity: 0.2;
}

@keyframes curve {
    0% {
        background-position-x: 0;
    }
    100% {
        background-position-x: 1000px;
    }
} */
