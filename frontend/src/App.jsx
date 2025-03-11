import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import VideoPlayer from './videoPlayer'
import { useRef } from 'react'


function App() {
  const playerRef = useRef(null)
  const videoLink = "http://localhost:8001/Uploads/courses/0fcd13ac-f7c1-415b-91ac-1a3ae1f610db/index.m3u8"

  const videoPlayerOptions={
    controls: true,
    responsive: true,
    fluid: true,
    sources:[{
      src: videoLink,
      type: 'application/x-mpegURL'
    }]
  }

  const handlePlayerReady = (player)=>{
    playerRef.current = player;

    player.on("waiting",()=>{
      videojs.log("Player is waiting");
    })

    player.on("dispose",()=>{
      videojs.log("Player will disposed");
    })

  }

  return (
    <>
    <div>
      <h1>Video Player</h1>
    </div>
    <VideoPlayer
      options={videoPlayerOptions}
      onReady={handlePlayerReady}
    />
      
    </>
  )
}

export default App
