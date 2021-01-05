import React from 'react';
import { Clip, Playlist, getPlaylist } from "./playlist";
import { Button } from "./Button";

import './App.css';

const PLAYLIST = process.env.REACT_APP_PLAYLIST_URL || "playlist.json";
const AUTO_REWIND = parseInt(process.env.REACT_APP_AUTO_REWIND || "5", 10) || 5;
const jumps = [
  {
    title: "-10 min",
    value: -600
  },
  {
    title: "-1 min",
    value: -60
  },
  {
    title: "-10 s",
    value: -10
  },
  {
    title: "10 s",
    value: 10
  },
  {
    title: "1 min",
    value: 60
  },
  {
    title: "10 min",
    value: 600
  }
]

const sleep = [1, 15, 30, 45, 60];

function App() {
  const player = React.useRef<HTMLAudioElement | null>();
  const sleepInterval = React.useRef(0);
  const sleepEnd = React.useRef(0);

  const [sleepLabel, setSleepLabel] = React.useState("");
  const [currentClip, setCurrentClip] = React.useState<Clip | null>(null);
  const [playlist, setPlaylist] = React.useState<Playlist | null>(null);

  React.useEffect(() => {
    (async () => {
      const initialEpisodeIndex = parseInt(window.localStorage.getItem("currentEpisodeIndex") || "0", 10) || 0;
      const initialTime = parseFloat(window.localStorage.getItem(`currentTime-${initialEpisodeIndex}`) || "0") || 0;
      const pl = await getPlaylist(PLAYLIST);

      if (pl) {
        setPlaylist(pl);
        setCurrentClip({ ...pl!.clips[initialEpisodeIndex], startTime: Math.max(0, initialTime - AUTO_REWIND) });
      }
    })();
  }, [])

  function onPlayerTimeUpdate(ev: React.SyntheticEvent<HTMLAudioElement>) {
    const time = ev.currentTarget.currentTime;
    window.localStorage.setItem(`currentTime-${currentClip!.index}`, time.toString());
  }

  function navigate(value: number) {
    console.log(`navigate: ${value}`);
  }
  function clearSleepInterval() {
    window.clearInterval(sleepInterval.current);
    sleepInterval.current = 0;
    setSleepLabel("");
  }

  function sleepIn(value: number) {
    if(sleepInterval.current) {
      clearSleepInterval();
    }

    sleepEnd.current = Date.now() + value*60000;
    setSleepLabel(`${value-1}:59`);

    sleepInterval.current = window.setInterval(() => {
      const currentTime = Date.now();
      if(currentTime >= sleepEnd.current) {
        clearSleepInterval();
        player.current?.pause();
      }
      else {
        const duration = Math.floor((sleepEnd.current - currentTime)/1000);
        setSleepLabel(`${Math.floor(duration/60)}:${(duration%60).toLocaleString("se", { minimumIntegerDigits: 2})}`)
      }
    }, 1000);
  }

  function onPlayerReady() {
    if (currentClip!.startTime)
      player.current!.currentTime = currentClip!.startTime;
  }
  function onClipEnded() {
    const nextIndex = currentClip!.index + 1;
    if (nextIndex < playlist!.clips.length)
      changeEpisode(nextIndex);
  }

  function changeEpisode(index: number) {
    const episode = playlist!.clips[index];
    episode.startTime = parseFloat(window.localStorage.getItem(`currentTime-${index}`) || "0") || 0;
    setCurrentClip(episode);
    window.localStorage.setItem("currentEpisodeIndex", index.toString());
  }

  const options = playlist?.clips?.map((c, i) => <option key={c.title} value={i} title={c.title}>{c.title}</option>)
  return (
    <div className="App">
      <h1>{playlist?.title || "Unreachable playlist"}</h1>
      {
        playlist &&
        <>
          <select value={currentClip?.index || 0} onChange={e => changeEpisode(parseInt(e.target.value, 10))}>
            {options}
          </select>
          <div id="current-clip">
            <h2>{currentClip?.title || "Select clip"}</h2>
            <audio
              ref={r => player.current = r}
              controls={true}
              autoPlay={true}
              src={currentClip?.link}
              onEnded={onClipEnded}
              onDurationChange={onPlayerReady}
              onTimeUpdate={onPlayerTimeUpdate} />
          </div>
          { false && <div id="navigation">
            <h2>Navigate</h2>
            <div className="buttons">
              {jumps.map(j => <Button key={j.title} negative={j.value < 0} onClick={() => navigate(j.value)}>{j.title}</Button>)}
            </div>
          </div> }
          <div id="sleep">
            <h2>Sleep timer</h2>
            {sleepLabel && <div className="sleeping">{sleepLabel} <Button onClick={() => clearSleepInterval()}>X</Button></div>}
            <div className="buttons">
              {sleep.map(s => <Button key={s} onClick={() => sleepIn(s)}>{`${s} min`}</Button>)}
            </div>
          </div>
        </>
      }
    </div>
  );
}

export default App;
