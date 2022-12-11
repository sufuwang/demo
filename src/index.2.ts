const fs = require("fs");
const path = require("path");
const http2 = require("http2");

const server = http2.createSecureServer({
	cert: fs.readFileSync(path.join(__dirname, "../src/cert.pem")),
	key: fs.readFileSync(path.join(__dirname, "../src/key.pem")),
});

server.on("stream", (stream: any, headers: any) => {
	const url = headers[":path"];
	if (url === "/a") {
		stream.end("ok");
		return;
	}
	if (url === "/delay") {
		setTimeout(() => {
			stream.end("ok");
		}, 50);
		return;
	}
	stream.end(fs.readFileSync(__dirname + "/../src/index.html", "utf8"));
});

server.listen(8002);
