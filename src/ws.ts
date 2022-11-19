import http from "http";
import { Socket } from "net";
import { secretKey, parsePayload, wrapPayload } from "./util";
import fs from "fs";

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
			if (content.length === 0) {
				console.info("等待后续帧, 当前帧大小: ", payload.length);
				return;
			}
			console.info(
				"输出帧, 当前帧大小: ",
				payload.length,
				", 输出负载大小: ",
				content.length
			);
			fs.writeFile(`./${content.length}.log`, content, "utf8", () => null);
		});
	}
	send(payload: string) {
		this.socket.write(wrapPayload(payload));
	}
}

export default WebSocket;
