import React from "react";

const Popup = ({ message, isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div style={popupStyles}>
      <p>{message}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};
  

export default Popup;