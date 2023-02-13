import fs from "fs";
import { helper } from "../utils";
import { PluginName } from "../utils";

/**
 * 代理: 使用远端资源响应
 */
export default {
	name: PluginName.Remote,
	handle: async function (instance: PluginInstance) {
		const { request, response, nextPlugin } = instance;
		if (nextPlugin !== this.name) {
			return;
		}

		console.info(this.name, ": ", request.url);

		const axiosResponse = await helper({ request, response });

		instance.data = axiosResponse.data;
		instance.type = "*";
		instance.nextPlugin = PluginName.Response;
	},
};
