import { GetItemFromLocalStorage } from "@/utils/localStorageFunc";
import { emitToastMessage } from "@/utils/toastFunc";

let ws_socket: WebSocket | null = null;

export const initializeWebSocket = () => {
  const deviceData = GetItemFromLocalStorage("deviceData");

  if (!deviceData || !deviceData.email || !deviceData.deviceLocation) {
    emitToastMessage(
      "Device location not found. Please go to the settings page to set up the location of the device to communicate with.",
      "error"
    );
    return null;
  }

  // Proceed with WebSocket connection if deviceData exists
  if (!ws_socket || ws_socket.readyState === WebSocket.CLOSED) {
    ws_socket = new WebSocket(`${process.env.NEXT_PUBLIC_BACKEND_WS}`);

    ws_socket.onopen = () => {
      console.log("WebSocket connection established");
      if (ws_socket?.readyState === WebSocket.OPEN) {
        ws_socket.send(
          JSON.stringify({
            event: "identify",
            source: "web_app",
            clientType: deviceData.email,
          })
        );
      } else {
        console.error("WebSocket connection is not open.");
      }
    };

    ws_socket.onclose = () => {
      console.log("WebSocket connection closed");
      ws_socket = null;
    };

    ws_socket.onerror = (error) => {
      console.log("WebSocket error:", error);
    };
  }

  return ws_socket;
};

export const getWebSocket = () => {
  if (!ws_socket || ws_socket.readyState !== WebSocket.OPEN) {
    console.warn(
      "WebSocket connection not established or is not open. Reinitializing..."
    );
    return initializeWebSocket();
  }
  return ws_socket;
};
