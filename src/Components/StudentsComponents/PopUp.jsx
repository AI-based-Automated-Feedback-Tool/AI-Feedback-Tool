import React from "react";
import "../../css/popUp.css"

const Popup = ({ message, isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="popup">
      <p className="popup-message">{message}</p>
      <button onClick={onClose} className="popup-close-button">Close</button>
    </div>
  );
};
  

export default Popup;