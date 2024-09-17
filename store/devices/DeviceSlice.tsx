import { Option } from "@/app/update_profile/DeviceSetup";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import HttpRequest from "../services/HttpRequest";
import { emitToastMessage } from "@/utils/toastFunc";

interface InitialStateTypes {
  devices: Option[];
  lecturerDeviceLocation: string;
  isFetchingDevicesConnected: boolean;
}

const initialState: InitialStateTypes = {
  devices: [],
  isFetchingDevicesConnected: false,
  lecturerDeviceLocation: "",
};

export const getDevicesConnected = createAsyncThunk(
  "device/getDevicesConnected",
  async () => {
    try {
      const response = await HttpRequest.get("/devices");
      const devices = response?.data?.devicesConnected;
      if (devices.length === 0) {
        emitToastMessage(
          "None of the device is connected, Ensure the devices are switched on",
          "error"
        );
      }
      const options = devices?.map((device: any) => ({
        value: device,
        label: device.toUpperCase(),
      }));
      return options;
    } catch (error: any) {
      emitToastMessage("Could not fetch your devices connected", "error");
    }
  }
);
export const getLecturerDeviceLocation = createAsyncThunk(
  "device/getLecturerDeviceLocation",
  async (email: string) => {
    try {
      const {
        data: {
          data: { deviceLocation },
        },
      } = await HttpRequest.get(`/devices/${email}`);
      if (!deviceLocation) {
        emitToastMessage(
          "You have not selected the location of the device to communicate with",
          "error"
        );
      }

      return deviceLocation;
    } catch (error: any) {
      emitToastMessage("Could not fetch your device location", "error");
    }
  }
);
const DeviceSlice = createSlice({
  name: "devices",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getDevicesConnected.pending, (state) => {
        state.isFetchingDevicesConnected = true;
      })
      .addCase(getDevicesConnected.fulfilled, (state, action) => {
        state.devices = action.payload;
        state.isFetchingDevicesConnected = false;
      })
      .addCase(getDevicesConnected.rejected, (state) => {
        state.isFetchingDevicesConnected = false;
      })
      .addCase(getLecturerDeviceLocation.fulfilled, (state, action) => {
        state.lecturerDeviceLocation = action.payload;
      });
  },
});
export default DeviceSlice.reducer;
