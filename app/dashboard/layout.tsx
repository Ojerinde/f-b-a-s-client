"use client";

import SideBar from "@/components/Dashboard/Sidebar";
import Navigation from "@/components/Navigation/Navigation";

export const sideBarLinks = [
  { name: "My Courses", link: "/dashboard/my_courses", iconUrl: "my_courses" },
  { name: "ESP 32", link: "/dashboard/esp32", iconUrl: "esp32" },
  { name: "Settings", link: "/dashboard/settings", iconUrl: "settings" },
];

export default function HostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <Navigation />
      <div className="dashboard">
        <div className="dashboard-left">
          <SideBar sideBarLinks={sideBarLinks} />
        </div>
        <div className="dashboard-right">{children}</div>
      </div>
    </section>
  );
}
