import React from "react";

export function useSleep(cb:Function):[string, (time:number)=>void] {
  const sleepInterval = React.useRef(0);
  const sleepEnd = React.useRef(0);
  const [label, setLabel] = React.useState("");

  React.useEffect(() => {
    return () => {
      if(sleepInterval.current) {
        sleepInterval.current = 0;
        window.clearInterval(sleepInterval.current);
      }
    }
  }, [])

  const clearSleepInterval = React.useCallback(() => {
    window.clearInterval(sleepInterval.current);
    sleepInterval.current = 0;
    setLabel("");
  }, [setLabel]);

  const sleepIn = React.useCallback((value: number) => {
    if(sleepInterval.current) {
      clearSleepInterval();
    }
    if(!value)
      return;

    sleepEnd.current = Date.now() + value*60000;
    setLabel(`${value-1}:59`);

    sleepInterval.current = window.setInterval(() => {
      const currentTime = Date.now();
      if(currentTime >= sleepEnd.current) {
        clearSleepInterval();
        cb();
      }
      else {
        const duration = Math.floor((sleepEnd.current - currentTime)/1000);
        setLabel(`${Math.floor(duration/60)}:${(duration%60).toLocaleString("se", { minimumIntegerDigits: 2})}`)
      }
    }, 1000);
  }, [clearSleepInterval, setLabel, cb]);

  return [label, sleepIn];
}