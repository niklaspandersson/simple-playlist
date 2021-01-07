import React from "react";
import { Button } from "../Button";

type Props = {
  onNavigate(t:number):void;
}

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

export const NavControls:React.FC<Props> = ({onNavigate}) => {
  return <div id="nav">
    {jumps.map(j => <Button key={j.title} className={j.value < 0 ? 'negative' : undefined} onClick={() => onNavigate(j.value)}>{j.title}</Button>)}
  </div>
}
