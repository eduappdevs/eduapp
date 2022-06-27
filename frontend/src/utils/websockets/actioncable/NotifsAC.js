import { getOfflineUser } from "../../OfflineManager";
import { TOKEN } from "../../../API";
import ACManager from "../ACManager";
import EncryptionUtils from "../../EncryptionUtils";
import * as NOTIFSMODAL from "../../../components/notifications/notifsModal";
import pushNotify from "../../../components/notifications/notifications";
import IDBManager from "../../IDBManager";

export default class NotifsAC extends ACManager {
  idbm = new IDBManager();

  constructor() {
    super("user notifications.");
    this.chatId = null;
  }

  instanceURC_IDB() {
    this.idbm.getStorageInstance("urc-db", "urc-store").then((res) => {
      console.log("urc-db initialized.");
    });
  }

  async handleNotifs(data) {
    switch (data.command) {
      case "error":
        console.error(
          "Could not handle notification: " + this.receivedData.data.error
        );
        break;
      case "new_msg":
        data.msg = EncryptionUtils.decrypt(data.msg, atob(data.key));

        if (document.hasFocus()) {
          NOTIFSMODAL.instanceModal(data);
        } else {
          NOTIFSMODAL.instanceModal(data);
          pushNotify(data.msg.message, data.profile_pic, data.author_name);
        }
        if (this.idbm.keyExists(data.author_name)) {
          console.log(await this.idbm.get(data.author_name));

          // .then((res)=>{
          //     let value = parseInt(res)++
          //     this.idbm.update(data.author_name,{value})
          // })
        } else {
          let value = 1;
          this.idbm.set(data.author_name, {
            value,
          });
        }

        break;
      default:
        break;
    }
  }

  defaultReceived(data) {
    super.defaultReceived(data);
    this.handleNotifs(data);
  }

  async generateChannelConnection(userId) {
    this.connection = this.consumer.subscriptions.create({
      channel: "UserNotifsChannel",
      user_id: userId ? userId : getOfflineUser().user.id,
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

      this.connection.send(payload);
    }
    if (args.length !== 0) {
      switch (args.type) {
        case "notification":
          this.from = args.from;
          this.to = args.to;

          this.generateChannelConnection(this.to).then(() => {
            this.sendChannelCmd(cmd);
          });

        default:
          break;
      }
    }
  }
}
