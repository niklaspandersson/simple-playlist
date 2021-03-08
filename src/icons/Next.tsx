import React from "react";

type Props = {
  size: number
};

export const Next:React.FC<Props> = ({ size }) => {
  return <svg className="icon icon-next" viewBox="0 0 100 100" width={size} height={size}>
    <rect x="90%" y="0" height="100%" width="10%" fill="white" stroke="none" />
    <polygon points="10,0 90,50, 10,100" fill="white" />
  </svg>
}