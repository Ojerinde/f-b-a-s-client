import { useLogoutFunc } from "@/hooks/useLogout";
import React from "react";

type LogoutModalProps = {
  onClose: () => void;
};

const LogoutModal: React.FC<LogoutModalProps> = ({ onClose }) => {
  const logout = useLogoutFunc();

  return (
    <div className="flex flex-col justify-center items-center bg-white p-[5rem] rounded-lg relative w-[40vw]">
      <p className="text-[#555] font-semibold text-[2rem] text-center w-[80%]">
        Are you sure you want to logout?
      </p>

      <div className="mt-6 flex justify-around w-full items-center">
        <button
          onClick={() => logout("/")}
          className="border border-custom-black rounded opacity-50 text-[1.6rem] font-medium text-custom-black py-4 basis-[40%]"
        >
          Yes
        </button>
        <button
          onClick={onClose}
          className="border border-custom-orange text-[1.6rem] font-medium rounded opacity-50 bg-custom-orange-dark-1 hover:bg-custom-orange text-white py-4 basis-[40%]"
        >
          No
        </button>
      </div>
    </div>
  );
};

export default LogoutModal;
