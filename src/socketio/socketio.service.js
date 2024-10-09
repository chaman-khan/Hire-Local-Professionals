import { io } from "socket.io-client";
class SocketioService {
  socket;
  constructor() {}

  // connect to socket server
  socketConnection(authToken, host, port) {
    console.log("authToken",authToken)
    console.log("first",host+" "+port)
    this.socket = io(host + ":" + 3000, {
      auth: {
        token: authToken,
      },
      secure: true,
      reconnect: true,
    });
    return this.socket;
  }

  // connect user
  connectUser(userId) {
    if (this.socket) {
      this.socket.emit("connected-users", { users_connected: userId });
    }
  }

  // send message
  sendMessage(data) {
    if (this.socket && this.socket.connected) {
      this.socket.emit("send_msg", data);
    }
  }

}

export default new SocketioService();
