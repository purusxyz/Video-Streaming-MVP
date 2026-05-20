import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import VideoPlayer from './videoPlayer'
import { useRef, useEffect } from "react";

function App() {
  const playerRef = useRef(null)
  const videoLink = "http://localhost:5000/upload/courses/82f0003f-f562-40e2-a55c-4fc02c10465d/index.m3u8"
  
  const videoPlayerOptions = {
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: videoLink,
        type: "application/x-mpegURL"
      }
    ]
  }

  const handlePlayerReady = (player) => {
    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose")
    });
  };


  return (
   <>
     <div>
      <h1>Video player</h1>
     </div>
     <VideoPlayer
     options={videoPlayerOptions} 
     onReady={handlePlayerReady}
     />
   </>
  )
}

export default App
