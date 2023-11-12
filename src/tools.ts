export const Key = {
	webWorker: "sync-by-web-worker",
	storage: "sync-by-storage",
};

export const getRandomCount = () =>
	parseInt((Math.random() * 1000).toString()).toString();

export class Storage {
	private static Key = "session-storage";

	public static listener() {
		window.onstorage = () => {
			console.info("trigger");
			Storage.sync();
			Storage.endSync();
		};
		console.info("listener");
	}
	public static unListener() {
		window.onstorage = null;
		console.info("unListener");
	}

	public static startSync() {
		localStorage.setItem(this.Key, JSON.stringify(sessionStorage));
	}
	public static sync() {
		const ss = JSON.parse(localStorage.getItem("session-storage") ?? "{}");
		console.info("storage: ", ss);
		Object.entries<string>(ss).forEach(([key, value]) => {
			sessionStorage.setItem(key, value);
		});
		Storage.endSync();
	}
	public static endSync() {
		localStorage.removeItem(this.Key);
	}
}

export class Worker {
	private static handle: SharedWorker;

	private static getHandle() {
		if (!Worker.handle) {
			Worker.handle = new SharedWorker("./src/worker.js");
		}
		return Worker.handle;
	}

	public static listener() {
		const handle = Worker.getHandle();
		console.info("listener: ", handle);
		handle.port.onmessage = function (event: any) {
			console.info("worker: ", event.data);
			const ss = JSON.parse(event.data);
			Object.entries<string>(ss).forEach(([key, value]) => {
				sessionStorage.setItem(key, value);
			});
		};
		console.info("worker listener");
	}

	public static unListener() {
		Worker.handle.port.onmessage = null;
		console.info("worker unListener");
	}

	public static startSync() {
		const handle = Worker.getHandle();
		const data = JSON.stringify({ ...sessionStorage, type: "set" });
		handle.port.postMessage(data);
	}

	public static sync() {
		const handle = Worker.getHandle();
		handle.port.postMessage(JSON.stringify({ type: "sync" }));
	}

	public static endSync() {
		const handle = Worker.getHandle();
		handle.port.postMessage(JSON.stringify({ type: "clear" }));
	}
}
