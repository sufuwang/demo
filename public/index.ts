const ws = new WebSocket("ws://localhost:3000");

ws.addEventListener("message", function (event) {
	console.log("Message from serve: ", event.data);

	const buffer = new Int8Array(30000);
	buffer[0] = 255;
	for (let i = 1; i < 29999; i++) {
		buffer[i] = i % 255;
	}
	buffer[29999] = 255;
	ws.send(buffer);

	setTimeout(() => {
		let data = "";
		for (let i = 0; i < 20000; i++) {
			data += i;
		}
		ws.send("s" + data + "&");
	}, 5000);
});

const handle = () => {
	const data = document.getElementsByTagName("input")[0].files![0];
	ws.send(data);
};
