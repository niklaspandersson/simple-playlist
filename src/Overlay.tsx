import React from "react";
import "./Overlay.css";

type OverlayProps = {
  onClose?():void;
}

export const Overlay:React.FC<OverlayProps> = ({onClose, children}) => {
  React.useEffect(() => {
    function handler(ev:KeyboardEvent) {
      if(ev.key === 'Escape')
        onClose?.();
    }

    window.addEventListener("keydown", handler);
    document.body.classList.toggle("noscroll", true);
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.classList.toggle("noscroll", false);
    }
  }, [onClose])
  return <div className="overlay" onClick={() => onClose?.()}>
    <div className="overlay-contents">
      {children}
    </div>
  </div>
};