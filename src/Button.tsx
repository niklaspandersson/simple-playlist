import React from "react";

type Props = {
  id?:string;
  className?:string;
  onClick(): void;
}

export const Button:React.FC<Props> = ({id, className, children, onClick}) => {
  return <div id={id} className={`button ${className ? className : ''}`} onClick={ev => {
    ev.stopPropagation();
    onClick();
  }}>
    {children}
  </div>
}