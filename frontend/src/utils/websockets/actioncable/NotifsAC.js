import { getOfflineUser } from "../../OfflineManager";
import { TOKEN } from "../../../API";
import ACManager from "../ACManager";

export default class NotifsAC extends ACManager {
  constructor() {
    super("user notifications.");
    this.chatId = null;
  }

  handleNotifs(data) {
    switch (data.command) {
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
    this.handleNotifs(data);
  }

  async generateChannelConnection() {
    this.connection = this.consumer.subscriptions.create({
      channel: "UserNotifsChannel",
      user_id: getOfflineUser().user.id,
      token: TOKEN,
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
          default:
            break;
        }
      }

      this.connection.send(payload);
    }
  }
}
