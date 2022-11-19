import { readFile } from "fs";
import http from "http";
import { Socket } from "net";
import WebSocket from "./ws";

const server = http.createServer();

server.on("request", (req: http.IncomingMessage, socket: Socket) => {
	if (req.url!.startsWith("/public")) {
		readFile(__dirname + "/.." + req.url, (err, data) => {
			socket.end(data);
		});
	}
});

server.on("upgrade", (req, socket) => {
	const ws = new WebSocket(req, socket as Socket);
	ws.send(Date.now().toString());
});

server.listen(3000);
