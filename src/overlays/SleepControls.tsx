import React from "react";
import { Button } from "../Button";

type Props = {
  isActive:boolean;
  onSelect(t:number):void;
}

const sleep = [15, 30, 45, 60];

export const SleepControls:React.FC<Props> = ({isActive, onSelect}) => {

  const select = React.useCallback((value:number) => {
    onSelect(value);
  }, [onSelect]);

  return <div id="sleep">
    {sleep.map(s => <SleepButton key={s} value={s} onClick={select} />)}
    {isActive && <SleepButton id="clear" value={0} className="invert" key={"clear"} onClick={select}>✖</SleepButton>}
  </div>
}

const SleepButton:React.FC<{id?:string, className?:string, value:number, onClick:(v:number)=>void}> = ({id, className, value, onClick, children}) => {
  function onclick() {
    onClick(value);
  }
  return <Button id={id} onClick={onclick}><span>{value || children}</span></Button>
}