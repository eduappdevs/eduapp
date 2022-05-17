import { createConsumer } from "@rails/actioncable";
import { CHATWS } from "../../../config";
import { getOfflineUser } from "../../OfflineManager";

export default class ACManager {
  constructor() {
    this.consumer = createConsumer(CHATWS);
    this.connection = null;
    this.hasConnected = {};
    this.chatCode = null;
  }

  generateChannelConnection(chatIdentifier) {
    this.connection = this.consumer.subscriptions.create({
      channel: "ChatChannel",
      chat_room: chatIdentifier,
      connection_requester: getOfflineUser().user.id,
    });

    this.connection.connected = () => {
      console.log("Connected.");
      this.hasConnected.state = true;
    };

    this.connection.received = (data) => {
      switch (data.command) {
        case "new_message":
          document.dispatchEvent(
            new CustomEvent("new_msg", {
              detail: {
                message: data.message,
                user: data.user,
                id: data.id,
                chat_base: data.chat_base,
                send_date: data.send_date,
              },
            })
          );
          break;
        case "error":
          console.error(
            "Could not save message: " + this.receivedData.data.error
          );
          break;
        default:
          break;
      }
    };

    this.connection.rejected = () => {
      window.location.href = "/chat";
    };

    this.connection.disconnected = () => {
      console.log("Connection force closed.");
      this.hasConnected.state = false;
    };

    let hasConnected = this.hasConnected;
    let timeOut = 0;

    return new Promise((resolve, reject) => {
      (function waitForData() {
        if (timeOut >= 5000)
          return reject(
            new Error("Could not connect to ActionCable WebSocket.")
          );
        if (hasConnected.state) return resolve();
        setTimeout(() => {
          waitForData();
          timeOut += 100;
        }, 100);
      })();
    });
  }

  closeConnection() {
    if (this.connection != null) {
      this.connection.unsubscribe();
      this.hasConnected.state = false;
      this.connection = null;
      console.log("Disconnected.");
    }
  }

  sendChannelCmd(cmd, ...args) {
    if (this.connection != null) {
      let payload = {
        command: cmd,
      };

      if (args.length !== 0) {
        switch (cmd) {
          case "message":
            payload.message = args[0];
            payload.author = args[1];
            payload.send_date = args[2];
            break;
          default:
            break;
        }
      }

      this.connection.send(payload);
    }
  }
}
