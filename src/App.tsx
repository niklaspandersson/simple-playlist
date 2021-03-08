import React from 'react';
import { Clip, Playlist, getPlaylist } from "./playlist";
import { Overlay } from "./Overlay";
import sleepIcon from "./sleep.png";
import navIcon from "./nav.png";
import { Next } from "./icons/Next";

import './App.css';
import { SleepControls } from './overlays/SleepControls';
import { NavControls } from './overlays/NavControls';
import { ClipsControls } from './overlays/ClipsControls';
import { useSleep } from './hooks/useSleep';
import { Prev } from './icons/Prev';

const PLAYLIST = process.env.REACT_APP_PLAYLIST_URL || "playlist.json";
const AUTO_REWIND = parseInt(process.env.REACT_APP_AUTO_REWIND || "5", 10) || 5;
const MIN_SAVE_TIME = 5;

function App() {
  const player = React.useRef<HTMLAudioElement | null>();
  const pausePlayer = React.useCallback(function() { player.current?.pause() }, []);

  const [currentClip, setCurrentClip] = React.useState<Clip | null>(null);
  const [playlist, setPlaylist] = React.useState<Playlist | null>(null);
  const [sleepLabel, sleepIn] = useSleep(pausePlayer);

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
    if(time > MIN_SAVE_TIME)
      window.localStorage.setItem(`currentTime-${currentClip!.index}`, time.toString());
    else
      window.localStorage.removeItem(`currentTime-${currentClip!.index}`);
  }

  const navigate = React.useCallback((value: number) => {
    if(player.current?.duration)
      player.current!.currentTime = Math.min(Math.max(0, player.current!.currentTime + value), player.current!.duration);
  }, []);

  function onPlayerReady() {
    if (currentClip!.startTime && currentClip!.startTime < player.current!.duration)
      player.current!.currentTime = currentClip!.startTime;
  }
  function onClipEnded() {
    window.localStorage.setItem(`currentTime-${currentClip!.index}`, "end");
    const nextIndex = currentClip!.index + 1;
    if (nextIndex < playlist!.clips.length)
      changeEpisode(nextIndex);
  }

  const changeEpisode = React.useCallback((index: number) => {
    const episode = playlist!.clips[index];
    episode.startTime = parseFloat(window.localStorage.getItem(`currentTime-${index}`) || "0") || 0;
    setCurrentClip(episode);
    window.localStorage.setItem("currentEpisodeIndex", index.toString());
  }, [setCurrentClip, playlist]);

  function navEpisode(dir:number) {
    if(currentClip) {
      let nextIndex = currentClip.index+dir;
      if(nextIndex >= 0 && nextIndex < (playlist?.clips?.length || 0))
        changeEpisode(nextIndex);
    }
  }

  const setSleep = React.useCallback((t:number) => {
    sleepIn(t);
    setOverlay(undefined);
  }, [sleepIn, setOverlay]);

  const closeOverlay = React.useCallback(() => {
    setOverlay(undefined)
  }, [setOverlay]);

  const onNavigate = React.useCallback((t:number) => {
    navigate(t); 
    setOverlay(undefined);
  }, [navigate, setOverlay]);

  const selectClip = React.useCallback((c:Clip) => {
    changeEpisode(c.index);
    setOverlay(undefined);
  }, [changeEpisode, setOverlay]);

  const hasSleepLabel = !!sleepLabel;
  const overlayElement = React.useMemo(() => {
    let res;
    switch (overlay) {
      case 'sleep':
        res = (<SleepControls isActive={hasSleepLabel} onSelect={setSleep} />)
        break;
    
      case 'nav':
        res = <NavControls onNavigate={onNavigate} />
        break;
  
      case 'clips':
        res = <ClipsControls currentIndex={currentClip?.index} clips={playlist?.clips || []} onSelect={selectClip} />
        break;
  
      default:
        break;
    }
    return res;
  }, [overlay, playlist?.clips, currentClip, hasSleepLabel, setSleep, onNavigate, selectClip]);

  return (
    <div className="App">
      <h1>{playlist?.title || "Unreachable playlist"}</h1>
      {
        playlist &&
        <>
          <nav><button className="prev clickable" onClick={() => navEpisode(-1)}><Prev size={20} /></button><button className="current clickable" onClick={() => setOverlay('clips')}>{currentClip?.title || "Select clip"}</button><button className="next clickable" onClick={() => navEpisode(1)}><Next size={20} /></button></nav>
          <div id="current-clip">
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
            <Overlay onClose={closeOverlay}>
              {overlayElement}
            </Overlay>
          }
        </>
      }
    </div>
  );
}


export default App;
