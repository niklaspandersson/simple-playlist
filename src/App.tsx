import React from 'react';
import { Clip, Playlist, getPlaylist } from "./playlist";
import { Overlay } from "./Overlay";
import sleepIcon from "./sleep.png";
import navIcon from "./nav.png";

import './App.css';
import { SleepControls } from './overlays/SleepControls';
import { NavControls } from './overlays/NavControls';

const PLAYLIST = process.env.REACT_APP_PLAYLIST_URL || "playlist.json";
const AUTO_REWIND = parseInt(process.env.REACT_APP_AUTO_REWIND || "5", 10) || 5;

function App() {
  const player = React.useRef<HTMLAudioElement | null>();
  const sleepInterval = React.useRef(0);
  const sleepEnd = React.useRef(0);

  const [sleepLabel, setSleepLabel] = React.useState("");
  const [currentClip, setCurrentClip] = React.useState<Clip | null>(null);
  const [playlist, setPlaylist] = React.useState<Playlist | null>(null);

  const [overlay, setOverlay] = React.useState<string|undefined>(undefined); 

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
    if(player.current?.duration)
      player.current!.currentTime = Math.min(Math.max(0, player.current!.currentTime + value), player.current!.duration);
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
    if(!value)
      return;

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

  let overlayElement = <div></div>
  switch (overlay) {
    case 'sleep':
      overlayElement = (<SleepControls isActive={!!sleepLabel} onSelect={t => { sleepIn(t); setOverlay(undefined)} } />)
      break;
  
    case 'nav':
       overlayElement = <NavControls onNavigate={t => { navigate(t); setOverlay(undefined)} } />
       break;

    default:
      break;
  }

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

          <div id="controls">
            <img className="clickable" alt="show navigation controls" src={navIcon} onClick={() => setOverlay('nav')} />
            <img className="clickable" alt="show sleep controls" src={sleepIcon} onClick={() => setOverlay('sleep')} /> 
          </div>
          <div id="status">
            {sleepLabel && <div className="sleeping">{sleepLabel}</div>}
          </div>
         
          { overlay && 
            <Overlay onClose={() => setOverlay(undefined)}>
              {overlayElement}
            </Overlay>
          }
        </>
      }
    </div>
  );
}


export default App;
