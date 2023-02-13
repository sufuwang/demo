import fs from "fs";
import { helper } from "../utils";
import { PluginName } from "../utils";

/**
 * 检查是否需要代理
 */
export default {
	name: PluginName.Check,
	handle: async function (instance: PluginInstance) {
		const { request, nextPlugin } = instance;
		if (nextPlugin !== this.name) {
			return;
		}

		const [domain] = (request.url as string)
			.replace(/^http:\/\//, "")
			.split("/");
		const url = `http://${domain}`;

		console.info(this.name, url);

		instance.nextPlugin = Object.keys(instance.proxyConfig).includes(url)
			? PluginName.Proxy
			: PluginName.Remote;
	},
};
