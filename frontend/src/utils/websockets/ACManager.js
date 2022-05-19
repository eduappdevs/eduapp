import { createConsumer } from "@rails/actioncable";
import { CHATWS } from "../../config";

/**
 @constructor
 @abstract
 */
export default class ACManager {
  constructor(class_type) {
    this.consumer = createConsumer(CHATWS);
    this.connection = null;
    this.hasConnected = {};
    this.class_type = class_type ? class_type : "parent_class";
  }

  dispatchCustomEvent(eventName, data) {
    document.dispatchEvent(
      new CustomEvent(eventName, {
        detail: data,
      })
    );
  }

  defaultConnect() {
    console.log("Connected to: " + this.class_type);
    this.hasConnected.state = true;
  }

  defaultReceived(data) {
    switch (data.command) {
      case "error":
        console.error("An ActionCable error returned: " + data.error);
        return;
      default:
        break;
    }
  }

  defaultRejected(fallback_location = "/home") {
    console.log("Rejected from: " + this.class_type);
    window.location.href = fallback_location;
  }

  defaultDisconnected() {
    console.log("Connection force closed from: " + this.class_type);
    this.hasConnected.state = false;
  }

  makeitAsync() {
    let hasConnected = this.hasConnected;
    let timeOut = 0;
    let my_class_type = this.class_type;

    return new Promise((resolve, reject) => {
      (function waitForData() {
        if (timeOut >= 5000)
          return reject(
            new Error(
              "Could not connect to ActionCable WebSocket for the type: " +
                my_class_type
            )
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
      console.log("Disconnected from: " + this.class_type);
    }
  }

  sendChannelCmd(cmd, ...args) {
    console.log("Sending: " + cmd);
    console.log("Args: " + args);
  }
}
