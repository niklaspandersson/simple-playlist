import React from "react";

type Props = {
  size: number
};

export const Prev:React.FC<Props> = ({ size }) => {
  return <svg className="icon icon-next" viewBox="0 0 100 100" width={size} height={size}>
    <rect x="0" y="0" height="100%" width="10%" fill="white" stroke="none" />
    <polygon points="10,50 90,0 90,100" fill="white" />
  </svg>
}