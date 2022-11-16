const ws = new WebSocket("ws://localhost:3000");

let index = 0;
// setInterval(() => {
// 	let data = "";
// 	if (index === 0) {
// 		for (let i = 0; i < 16000; i++) {
// 			data += i;
// 		}
// 	} else {
// 		data += Date.now();
// 	}
// 	ws.send(data + "&");
// 	index++;
// }, 1000);

ws.addEventListener("message", function (event) {
	console.log("Message from serve: ", event.data);
	if (index === 0) {
		let data = "";
		for (let i = 0; i < 15000; i++) {
			data += i;
		}
		ws.send(data + "&");
		index++;
	}
});
