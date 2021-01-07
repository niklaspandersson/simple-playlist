import React from "react";
import { Button } from "../Button";

type Props = {
  isActive:boolean;
  onSelect(t:number):void;
}

const sleep = [15, 30, 45, 60];

export const SleepControls:React.FC<Props> = ({isActive, onSelect}) => {
  return <div id="sleep">
    {sleep.map(s => <Button key={s} onClick={() => onSelect(s)}><span>{`${s}`}</span></Button>)}
    {isActive && <Button id="clear" className="invert" key={"clear"} onClick={() => onSelect(0)}><span>✖</span></Button>}
  </div>
}