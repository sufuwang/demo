const ws = new WebSocket("ws://localhost:3000");

ws.addEventListener("message", function (event) {
	console.log("Message from serve: ", event.data);
	let data = "";
	for (let i = 0; i < 20000; i++) {
		data += i;
	}
	ws.send("s" + data + "&");

	setTimeout(() => {
		ws.send("s" + Date.now() + "&");
	}, 1000);
});
