import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Typewriter from "typewriter-effect";
import OverlayModal from "../Modals/OverlayModal";
import LogoutModal from "../Modals/LogoutModal";
import { GetItemFromLocalStorage } from "@/utils/localStorageFunc";
import { GiExitDoor } from "react-icons/gi";

const Navigation = () => {
  const router = useRouter();
  const [showLogoutVerificationModal, setShowLogoutVerificationModal] =
    useState<boolean>(false);
  const [showLogoutText, setShowLogoutText] = useState(false);
  const loggedInLecturer = GetItemFromLocalStorage("user");

  return (
    <nav className="navigation">
      <figure
        style={{ borderRadius: "20%", overflow: "hidden" }}
        onClick={() => router.push("/")}
      >
        <Image
          src="/images/F-B-A-S.png"
          alt="Logo"
          width={100}
          height={80}
          style={{ objectFit: "cover" }}
        />
      </figure>

      <div className="navigation-text">
        <Typewriter
          options={{
            strings: [`Hello! ${loggedInLecturer?.name} `],
            autoStart: true,
            loop: true,
            delay: 130,
            deleteSpeed: 70,
          }}
        />
      </div>

      <div>
        <button
          type="button"
          className="navigation-logout"
          onClick={() => setShowLogoutVerificationModal(true)}
          onMouseEnter={() => setShowLogoutText(true)}
          onMouseLeave={() => setShowLogoutText(false)}
        >
          <GiExitDoor className="icon" />
          {showLogoutText && <p className="navigation-title">Logout</p>}
        </button>
      </div>
      {showLogoutVerificationModal && (
        <OverlayModal onClose={() => setShowLogoutVerificationModal(false)}>
          <LogoutModal
            onClose={() => setShowLogoutVerificationModal(false)}
          ></LogoutModal>
        </OverlayModal>
      )}
    </nav>
  );
};
export default Navigation;