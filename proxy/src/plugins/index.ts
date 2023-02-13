import checkPlugin from "./check";
import responsePlugin from "./response";
import remotePlugin from "./remote";
import proxyPlugin from "./proxy";
import proxyConfig from "../../proxy.config.json";

const Plugins = [checkPlugin, proxyPlugin, remotePlugin, responsePlugin];

const domains = Object.keys(proxyConfig)
	.filter((domain) => domain.startsWith("http://"))
	.map((domain) => (domain.endsWith("/") ? domain.replace(/\/$/, "") : domain));

console.info("Object.keys(proxyConfig): ", Object.keys(proxyConfig), domains);

const handler: Handler = async (server) => {
	const instance: PluginInstance = {
		...server,
		data: "",
		type: "*",
		nextPlugin: Plugins[0].name,
		proxyConfig,
	};

	for (const plugin of Plugins) {
		await plugin.handle(instance);
	}
};

export default handler;
