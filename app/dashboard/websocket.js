let ws_socket;

export const initializeWebSocket = () => {
  // Create WebSocket connection
  ws_socket = new WebSocket(`${process.env.NEXT_PUBLIC_BACKEND_WS}`);

  // Handle WebSocket events
  ws_socket.onopen = () => {
    console.log("WebSocket connection established");
  };

  ws_socket.onclose = () => {
    console.log("WebSocket connection closed");
  };

  ws_socket.onerror = (error) => {
    console.log("WebSocket error:", error);
  };

  return ws_socket;
};

export const getWebSocket = () => {
  if (!ws_socket || ws_socket.readyState !== WebSocket.OPEN) {
    console.warn("WebSocket connection not established");
  }
  return ws_socket;
};
