import React from "react";
import { Button } from "../Button";
import { Circle } from "../icons/Circle";
import { Clip } from "../playlist";
import classnames from "classnames";

type Props = {
  currentIndex?: number;
  clips:Clip[];
  onSelect(c:Clip):void;
}

export const ClipsControls:React.FC<Props> = ({clips, onSelect, currentIndex}) => {
  return <div id="clips">
    {clips.map(c => {
      const time = window.localStorage.getItem(`currentTime-${c.index}`);
      const mode = time ? (time==="end" ? "full" : "half") : "empty";
      return <div key={c.index} className={classnames({clip: true, current: c.index === currentIndex})}><Button onClick={() => onSelect(c)}><span>{`${c.title}`}</span><Circle mode={mode} /></Button></div>
    })
    }
  </div>
}