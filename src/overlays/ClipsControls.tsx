import React from "react";
import { Button } from "../Button";
import { Clip } from "../playlist";

type Props = {
  clips:Clip[];
  onSelect(c:Clip):void;
}

export const ClipsControls:React.FC<Props> = ({clips, onSelect}) => {
  return <div id="clips">
    {clips.map(c => <Button key={c.index} onClick={() => onSelect(c)}><span>{`${c.title}`}</span></Button>)}
  </div>
}