import React from "react";

type TimerProps = {
  timeout: number;
  onTimeout():void;
}

export const Timer:React.FC<TimerProps> = ({timeout, onTimeout}) => {
  const [currentTime, setCurrentTime] = React.useState<number>();

  React.useEffect(() => {
    setCurrentTime(timeout);
  }, [timeout]);
  
  return <div className="timer">{currentTime}</div>
}