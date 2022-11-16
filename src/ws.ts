import http from "http";
import { Socket } from "net";
import { secretKey, parsePayload, wrapPayload } from "./util";

class WebSocket {
	req: http.IncomingMessage;
	socket: Socket;

	constructor(req: http.IncomingMessage, socket: Socket) {
		this.req = req;
		this.socket = socket;

		this.switchProtocol();
		this.receive();
	}

	switchProtocol() {
		const header = [
			"HTTP/1.1 101 Switching Protocols",
			"Upgrade: websocket",
			"Connection: Upgrade",
			`Sec-WebSocket-Accept: ${secretKey(this.req.headers)}`,
		]
			.concat("", "")
			.join("\r\n");
		this.socket.write(Buffer.from(header));
	}
	receive() {
		this.socket.on("data", (payload: Buffer) => {
			const content = parsePayload(payload);
			console.log("Message from client: ", content.slice(content.length - 1));
		});
	}
	send(payload: string) {
		this.socket.write(wrapPayload(payload));
	}
}

export default WebSocket;
