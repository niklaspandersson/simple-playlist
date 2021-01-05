import React from "react";

type Props = {
  negative?: boolean;
  onClick(): void;
}

export const Button:React.FC<Props> = ({negative, children, onClick}) => {
  return <div className={`button jump ${negative ? 'negative' : ''}`} onClick={onClick}>
    {children}
  </div>
}