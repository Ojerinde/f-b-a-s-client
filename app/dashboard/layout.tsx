"use client";

import SideBar from "@/components/Dashboard/Sidebar";
import Navigation from "@/components/Navigation/Navigation";
import { useEffect } from "react";
import { initializeWebSocket } from "./websocket";
import MobileSideBar from "@/components/Dashboard/MobileSidebar";
import { useAppDispatch } from "@/hooks/reduxHook";
import { getLecturerDeviceLocation } from "@/store/devices/DeviceSlice";
import { GetItemFromLocalStorage } from "@/utils/localStorageFunc";

const sideBarLinks = [
  { name: "My Courses", link: "/dashboard/my_courses", iconUrl: "my_courses" },
  { name: "Device", link: "/dashboard/esp32", iconUrl: "esp32" },
  { name: "Settings", link: "/dashboard/settings", iconUrl: "settings" },
];

export default function HostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    initializeWebSocket();
    dispatch(getLecturerDeviceLocation(GetItemFromLocalStorage("user")?.email));
  }, []);
  return (
    <section>
      <Navigation />
      <div className="dashboard">
        <div className="dashboard-left">
          <SideBar sideBarLinks={sideBarLinks} />
        </div>
        <div className="dashboard-left__mobile">
          <MobileSideBar sideBarLinks={sideBarLinks} />
        </div>
        <div className="dashboard-right">{children}</div>
      </div>
    </section>
  );
}
