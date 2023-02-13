import axios from "axios";

const handler = async ({ request, response }: ServerInstance) => {
	try {
		const { url, headers, method } = request;
		const axiosResponse = await axios.request({
			url,
			method,
			headers,
			responseType: "arraybuffer",
		});
		response.statusCode = axiosResponse.status;
		response.statusMessage = axiosResponse.statusText;
		Object.entries(axiosResponse.headers).forEach((item) => {
			response.setHeader(...item);
		});
		response.setHeader("_from", "my-proxy");
		return axiosResponse;
	} catch (err) {
		return Promise.reject(err);
	}
};

export default handler;
