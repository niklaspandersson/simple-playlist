import { off } from "process";
import React from "react";
import { Button } from "../Button";

type Props = {
  onNavigate(t:number):void;
}

const jumps = [
  {
    title: "-10",
    value: -600
  },
  {
    title: "-1",
    value: -60
  },
  {
    title: "-10 s",
    value: -10
  },
  {
    title: "+10 s",
    value: 10
  },
  {
    title: "+1",
    value: 60
  },
  {
    title: "+10",
    value: 600
  }
]

const THROTTLE = 500;

export const NavControls:React.FC<Props> = ({onNavigate}) => {
  const applyTimer = React.useRef(0);

  const [offset, setOffset] = React.useState(0);
  const resultLabel = `${offset<0 ? '-': ''}${Math.floor(Math.abs(offset)/60)}.${(Math.abs(offset)%60).toLocaleString("se", { minimumIntegerDigits: 2})}`
  
  function addOffset(val:number) {
    if(applyTimer.current) {
      window.clearTimeout(applyTimer.current);
      applyTimer.current = 0;
    }

    setOffset(prev => prev+val);
    applyTimer.current = window.setTimeout(() => onNavigate(offset+val), THROTTLE);
  }

  React.useEffect(() => {
    return () => {
      if(applyTimer.current) {
        window.clearTimeout(applyTimer.current);
        applyTimer.current = 0;
      }
    }
  }, []);

  return <div id="nav">
    <span className="result">{resultLabel}</span>
    <div className="buttons">
      {jumps.map(j => <Button key={j.title} className={`invert ${j.value < 0 ? 'negative' : undefined}`} onClick={() => addOffset(j.value)}>{j.title}</Button>)}
    </div>
  </div>
}
