import fs from "fs";
import { helper } from "../utils";
import { PluginName } from "../utils";

/**
 * 根据响应数据类型映射响应逻辑
 */
export default {
	name: PluginName.Response,
	handle: async function (instance: PluginInstance) {
		const { response, data, type, nextPlugin } = instance;
		if (nextPlugin !== this.name) {
			return;
		}
		console.info(this.name);

		switch (type) {
			case "application/javascript":
				response.setHeader("_response-modify", "application/javascript");
				response.end(data);
				break;
			default:
				response.end(data);
		}
	},
};
