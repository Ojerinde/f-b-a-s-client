"use client";
import DeviceSetup from "@/app/update_profile/DeviceSetup";
import { useAppDispatch } from "@/hooks/reduxHook";
import {
  getDevicesConnected,
  getLecturerDeviceLocation,
} from "@/store/devices/DeviceSlice";
import { GetItemFromLocalStorage } from "@/utils/localStorageFunc";
import { useEffect } from "react";

const DeviceSetupPage = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getDevicesConnected());
    dispatch(getLecturerDeviceLocation(GetItemFromLocalStorage("user").email));
  }, []);
  return <DeviceSetup />;
};

export default DeviceSetupPage;
