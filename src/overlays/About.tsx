import React from "react";

export const About:React.FC = ({children}) => {

  return <div id="about">
    <h3>Simple playlist</h3>
    <p>This is a demo of a simple playlist application which allows you to use common podcast features when listening through playlists of raw audio files.</p>
    <b>Features</b>
    <ul>
      <li>Remembers your progress</li>
      <li>Auto plays next clip when current ends</li>
      <li>Allows easy navigation in audio file in increments of 10 s, 1 min or 10 mins. Quickly tap multiple times to increase the amount to skip.</li>
      <li>Has sleep timer that pauses playback after a certain amount of time</li>
    </ul>
    <p>Audio from the NASA Audio Collection: <br /><a href="https://archive.org/details/nasaaudiocollection">https://archive.org/details/nasaaudiocollection</a></p>
    <p>Check out the code at: <br /><a href="https://github.com/niklaspandersson/simple-playlist">github.com/niklaspandersson/simple-playlist</a></p>
  </div>
}