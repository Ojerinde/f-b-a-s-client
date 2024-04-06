import React from "react";
import { ImSpinner10 } from "react-icons/im";

interface Props {
  color?: "white" | "blue";
}

const LoadingSpinner: React.FC<Props> = ({ color }) => {
  return (
    <div className="spinner-box">
      <ImSpinner10
        className={`spinner-icon ${
          color === "blue" ? "spinner-icon__blue" : "spinner-icon__white"
        }`}
      />
    </div>
  );
};
export default LoadingSpinner;
