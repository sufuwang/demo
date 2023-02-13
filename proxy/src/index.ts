import http, { IncomingMessage } from "http";
import { helper } from "./utils";
import plugins from "./plugins";

http
	.createServer((request: IncomingMessage, response) => {
		// plugins
		plugins({ request, response });

		//

		// if (true) {
		// 	helper({ request, response });
		// 	return;
		// }

		// 发送 HTTP 头部
		// HTTP 状态值: 200 : OK
		// 内容类型: text/plain
		// response.writeHead(200, { "Content-Type": "text/plain" });

		// 发送响应数据 "Hello World"
		// response.end("Hello World\n");
	})
	.listen(8888);

// 终端打印如下信息
console.log("Server running at http://127.0.0.1:8888/");
