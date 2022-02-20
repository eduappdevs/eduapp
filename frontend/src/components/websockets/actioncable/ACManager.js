import { createConsumer } from "@rails/actioncable";

export default class ACManager {

	constructor() {
		this.consumer = createConsumer("ws://localhost:3000/chat");
		this.connection = null;
		this.hasConnected = {};
		this.chatCode = null;
		this.receivedData = {};
	}

	generateChannelConnection(chatIdentifier) {
		this.connection = this.consumer.subscriptions.create(
			{
				channel: "ChatChannel",
				chat_code: chatIdentifier[chatIdentifier.length - 1],
				chat_room: chatIdentifier,
				user_id: localStorage.userId
			}
		);

		this.connection.connected = () => {
			console.log("CONNECTED");
			this.hasConnected.state = true;
		}

		this.connection.received = (data) => {
			console.log("RECEIVED: ", data);
			this.receivedData.data = data;
			if (this.receivedData.data.command !== undefined && this.receivedData.data.command === "new_message") {
				document.dispatchEvent(new CustomEvent("new_msg", {
					"detail": this.receivedData.data
				}));
				this.emptyReceivedData();
			}
		}

		this.connection.disconnected = () => {
			console.log("Connection force closed.")
			this.hasConnected.state = false;
		}

		let hasConnected = this.hasConnected;
		let timeOut = 0;

		return new Promise((resolve, reject) => {
			(function waitForData() {
				if (timeOut >= 5000) return reject(new Error("Could not connect to ActionCable WebSocket."));
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
			console.log("Unsubscribed");
		} else console.log("No WS to close.");
	}

	sendChannelCmd(cmd, ...args) {
		if (this.connection != null) {
			let payload = {
				chat_code: this.chatCode,
				command: cmd
			};

			if (args.length !== 0) {
				switch (cmd) {
					case "message":
						payload.message = args[0]
						payload.author = args[1]
						payload.send_date = args[2]
						break;
					default:
						break;
				}
			}

			this.connection.send(payload);

			let wsResponse = this.receivedData;
			let timeOut = 0;

			switch (cmd) {
				case "gatherAll":
					return new Promise((resolve, reject) => {
						(function waitForData() {
							if (timeOut >= 30000) return reject(new Error("Could not receive new messages."));
							if (wsResponse.data !== undefined) return resolve(wsResponse.data);
							setTimeout(() => {
								waitForData();
								timeOut += 100;
							}, 100);
						})();
					});
				default:
					break;
			}
		}
	}

	emptyReceivedData() {
		this.receivedData.data = undefined;
	}
}