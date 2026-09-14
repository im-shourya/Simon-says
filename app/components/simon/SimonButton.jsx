import React from "react";

const SimonButton = ({
  color,
  isActive,
  disabled,
  onClick,
}) => {
  return (
    <button
      className={`simon-button ${color} ${isActive ? "active" : ""}`}
      onClick={() => onClick(color)}
      disabled={disabled}
      aria-label={`${color} button`}
    />
  );
};

export default SimonButton;
