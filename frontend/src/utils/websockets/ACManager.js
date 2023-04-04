import { createConsumer } from "@rails/actioncable";
import { CHATWS } from "../../config";

/**
 * @constructor
 * @abstract
 *
 * Abstract class to define other custom ActionCable websocket connections.
 */
export default class ACManager {
  constructor(class_type) {
    this.consumer = createConsumer(CHATWS);
    this.connection = null;
    this.hasConnected = {};
    this.class_type = class_type ? class_type : "parent_class";
  }

  /**
   * Creates and dispatches a new DOM Event.
   * @param {String} eventName Event's name.
   * @param {Object} data The data to relay in the event.
   */
  dispatchCustomEvent(eventName, data) {
    document.dispatchEvent(new CustomEvent(eventName, { detail: data }));
  }

  /**
   * Default method to use when connecting.
   */
  defaultConnect() {
    console.log("Connected to: " + this.class_type);
    this.hasConnected.state = true;
  }

  /**
   * Default method to use when handling received data.
   * @param {Object} data
   */
  defaultReceived(data) {
    switch (data.command) {
      case "error":
        console.error("An ActionCable error returned: " + data.error);
        return;
      default:
        break;
    }
  }

  /**
   * Default method used when the connection is rejected.
   * @param {String} fallback_location default = home
   */
  defaultRejected(fallback_location = "/home") {
    console.log("Rejected from: " + this.class_type);
    window.location.href = fallback_location;
  }

  /**
   * Default method used when disconnected from the websocket.
   */
  defaultDisconnected() {
    console.log("Connection force closed from: " + this.class_type);
    this.hasConnected.state = false;
  }

  /**
   * Makes a function async.
   * Made for asynchronzing the chat connection method.
   * @returns {Promise<void>} async
   */
  makeitAsync() {
    let hasConnected = this.hasConnected;
    let timeOut = 0;
    let my_class_type = this.class_type;

    return new Promise((resolve, reject) => {
      (function waitForData() {
        if (timeOut >= 5000) {
          reject(
            new Error(
              "Could not connect to ActionCable WebSocket for the type: " +
                my_class_type
            )
          );
          // window.location.href = "/chat";
        }
        if (hasConnected.state) return resolve();

        setTimeout(() => {
          waitForData();
          timeOut += 100;
        }, 100);
      })();
    });
  }

  /**
   * Default method used when closing a connection from the user.
   */
  closeConnection() {
    if (this.connection != null) {
      this.connection.unsubscribe();
      this.hasConnected.state = false;
      this.connection = null;
      console.log("Disconnected from: " + this.class_type);
    }
  }

  /**
   * Default method used when wanting to send something to the websocket.
   * @param {String} cmd
   * @param  {...any} args
   */
  sendChannelCmd(cmd, ...args) {
    console.log("Sending: " + cmd);
    console.log("Args: " + args);
  }
}
