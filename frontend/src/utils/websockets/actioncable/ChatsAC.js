import { getOfflineUser } from "../../OfflineManager";
import ACManager from "../ACManager";

/**
 * The action cable manager for the Chat websocket.
 */
export default class ChatsAC extends ACManager {
  constructor() {
    super("chat room.");
    this.chatCode = null;
  }

  handleChats(data) {
    switch (data.command) {
      case "new_message":
        this.dispatchCustomEvent("new_msg", {
          message: data.message,
          user: data.user,
          id: data.id,
          chat_base: data.chat_base,
          send_date: data.send_date,
        });
        break;
      case "error":
        console.error(
          "Could not save message: " + this.receivedData.data.error
        );
        break;
      default:
        break;
    }
  }

  defaultReceived(data) {
    super.defaultReceived(data);
    this.handleChats(data);
  }

  async generateChannelConnection(chatIdentifier) {
    console.log(chatIdentifier, "chatIdentifier");
    this.connection = this.consumer.subscriptions.create({
      channel: "ChatChannel",
      chat_room: chatIdentifier,
      connection_requester: getOfflineUser().user.id,
    });

    this.connection.connected = () => this.defaultConnect();

    this.connection.received = (data) => this.defaultReceived(data);

    this.connection.rejected = () => this.defaultRejected("/chat");

    this.connection.disconnected = () => this.defaultDisconnected();

    await this.makeitAsync();
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
