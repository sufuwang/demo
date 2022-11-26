import { useRef } from "react";
import { io } from "socket.io-client";

function App() {
	const inputRef = useRef<HTMLInputElement>(null);
	const socket = io("ws://localhost:3000");

	socket.on("connect", () => {
		console.info("connect");

		setInterval(() => {
			socket.emit("message", "ping");
		}, 5000);
	});
	socket.on("message", (d) => {
		console.info("message: ", d);
	});
	socket.on("disconnect", () => {
		console.info("disconnect");
	});

	const handle = () => {
		const d = inputRef.current!.files![0];
		console.info(d);
		socket.emit("file", { name: d.name, data: d });
	};

	return (
		<>
			<h2>ws</h2>
			<input ref={inputRef} type="file" />
			<button onClick={handle}>Go</button>
		</>
	);
}

export default App;
