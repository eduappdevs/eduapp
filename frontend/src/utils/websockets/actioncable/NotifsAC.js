import { getOfflineUser } from "../../OfflineManager";
import { TOKEN } from "../../../API";
import ACManager from "../ACManager";
import IDBManager from "../../IDBManager";

export default class NotifsAC extends ACManager {
  constructor() {
    super("user notifications.");
    this.db = new IDBManager();
    this.chatId = null;
  }

  async storeKeys(pri_key, pub_key) {
    await this.db.getStorageInstance("eduapp_info_storage", "user_keys");

    return await this.db.set(this.chatId, {
      owner_key: pri_key, // user private key for decrypting
      counterpart_key: pub_key, // counterpart user public key for encrypting
    });
  }

  handleNotifs(data) {
    switch (data.command) {
      case "chat_keys":
        let pattern = btoa(process.env.REACT_APP_ENCRYPTION_PATTERN) + "h";
        let priv_key = data.keys.owner_key.substring(pattern.length);
        let pub_key = data.keys.counterpart_key.substring(pattern.length);
        this.storeKeys(priv_key, pub_key).then(() => {
          this.dispatchCustomEvent("secured_keys", {
            owner: priv_key,
            counterpart: pub_key,
          });
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
    this.handleNotifs(data);
  }

  async generateChannelConnection(chat_identifier) {
    this.connection = this.consumer.subscriptions.create({
      channel: "UserNotifsChannel",
      user_id: getOfflineUser().user.id,
      token: TOKEN,
      chat_id: chat_identifier,
    });

    this.connection.connected = () => this.defaultConnect();

    this.connection.received = (data) => this.defaultReceived(data);

    this.connection.rejected = () => this.defaultRejected("/chat");

    this.connection.disconnected = () => this.defaultDisconnected();

    await this.makeitAsync();
    this.chatId = chat_identifier;
  }

  sendChannelCmd(cmd, ...args) {
    if (this.connection != null) {
      let payload = {
        command: cmd,
      };

      if (args.length !== 0) {
        switch (cmd) {
          case "keys_request":
            break;
          default:
            break;
        }
      }

      this.connection.send(payload);
    }
  }
}
