interface ServerInstance {
	request: IncomingMessage;
	response: ServerResponse;
}

interface ProxyConfig {
	[k: string]: string;
}

interface PluginInstance extends ServerInstance {
	type: string;
	nextPlugin: string;
	proxyConfig: ProxyConfig;
	data: any;
}

type Handler = (server: ServerInstance) => void;
