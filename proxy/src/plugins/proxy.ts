import fs from "fs";
import { helper } from "../utils";
import { PluginName } from "../utils";

/**
 * 代理: "使用本地资源响应
 */
export default {
	name: PluginName.Proxy,
	handle: async function (instance: PluginInstance) {
		const { request, response, nextPlugin, proxyConfig } = instance;

		if (nextPlugin !== this.name) {
			return;
		}

		// console.info("Yes: "", url);
		// const name = url.split("/");
		// fs.writeFileSync(`${__dirname}/images/${name[name.length - 1]}`, res.data, {
		// 	encoding: ""utf-8",
		// 	flag: ""w+",
		// });

		const url = request.url as string;
		const [proxyDomain, proxyTargetDomain] = Object.entries(proxyConfig).find(
			([domain]) => url.includes(domain)
		)!;

		if (url === proxyDomain) {
			request.url = proxyTargetDomain;
		} else if (url.startsWith(proxyDomain)) {
			request.url = url.replace(proxyDomain, proxyTargetDomain);
		}

		const axiosResponse = await helper({
			request,
			response,
		});

		console.info(
			this.name,
			": ",
			url,
			proxyDomain,
			proxyTargetDomain,
			request.url
		);

		const { "content-type": contentType } = axiosResponse.headers;
		instance.data = axiosResponse.data;
		instance.type = contentType;
		instance.nextPlugin = PluginName.Response;
	},
};
