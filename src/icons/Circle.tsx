import React from "react";

type Props = {
  mode: "empty"|"full"|"half"
};

export const Circle:React.FC<Props> = ({ mode }) => {
  return <svg style={{background: "transparent"}} className="icon icon-circle" viewBox="0 0 100 100" width="16" height="16">
    <defs>
      <clipPath id="cut-off-side">
        <rect x="0%" y="0" width="48%" height="100%" />
      </clipPath>
    </defs>
    <circle className="outline" fill="none" cx="50%" cy="50%" r="40%" stroke="white" strokeWidth="10"></circle>
    {mode !== "empty" && <circle className="fill" fill="white" cx="50%" cy="50%" r="40%" clipPath={mode === "half" ? "url(#cut-off-side)" : undefined}></circle>}
  </svg>
}