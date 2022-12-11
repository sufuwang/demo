import { readFileSync } from "fs";
import http from "http";

const server = http.createServer();

server.on("request", (req: http.IncomingMessage, res: any) => {
	if (req.url === "/") {
		res.end(readFileSync(__dirname + "/../src/index.html", "utf8"));
		return;
	}
	if (req.url === "/delay") {
		setTimeout(() => {
			res.end("ok");
		}, 1000);
		return;
	}
	res.end("ok");
});

server.listen(8011);
