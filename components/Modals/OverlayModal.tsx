"use client";

import React from "react";
import { createPortal } from "react-dom";
import LoadingSpinner from "../UI/LoadingSpinner/LoadingSpinner";

interface OverlayProps {
  children: React.ReactNode;
  onClose: () => void;
}

const Overlay: React.FC<OverlayProps> = ({ children }) => {
  return (
    <div className="fixed z-20 top-[23%] mx-4 sm:mx-0 left-[0%] xs:left-[13%] sm:left-[20%] md:left-[28%] lg:left-[29%]">
      {children}
    </div>
  );
};

const Backdrop = ({ onClose }: { onClose: () => void }) => {
  return (
    <div
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onClose();
        }
      }}
      className="fixed top-0 left-0 z-10 w-full h-full bg-[rgba(0,0,0,0.7)] backdrop-blur-[.5rem]"
      role="button"
      tabIndex={0}
    />
  );
};

const OverlayModal: React.FC<OverlayProps> = ({ children, onClose }) => {
  if (typeof window !== "undefined") {
    return (
      <>
        {createPortal(
          <Overlay onClose={onClose}>{children}</Overlay>,
          document.body
        )}
        {createPortal(<Backdrop onClose={onClose} />, document.body)}
      </>
    );
  }
  return <LoadingSpinner />;
};
export default OverlayModal;
