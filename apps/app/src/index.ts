import { Server } from "socket.io";
import { writeFile } from "fs";

const io = new Server({
	cors: {
		origin: "*",
		credentials: true,
	},
	maxHttpBufferSize: 1e10,
});

io.on("connection", (socket) => {
	console.info("connection");

	socket.on("message", (d) => {
		console.info("message: ", d);
		if (d === "ping") {
			socket.emit("message", "pong");
		}
	});
	socket.on("file", (d) => {
		writeFile(`../../${d.name}`, d.data, "utf-8", () => null);
		socket.emit("message", d.name);
	});
});

io.listen(3000);
