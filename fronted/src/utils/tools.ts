declare interface TRequestInit extends RequestInit {
	data?: Record<string, unknown>;
}

// const body = new URLSearchParams();
// body.append("userName", values.UserName);
// body.append("nickName", values.NickName);
// body.append("password", values.Password);
// body.append("email", values.Email);
// body.append("captcha", values.Captcha);
// fetch("http://localhost:3000/user/register", {
// 	method: "POST",
// 	headers: {
// 		"content-type": "application/x-www-form-urlencoded",
// 	},
// 	body,
// });

// fetch("http://localhost:3000/user/register", {
// 	method: "POST",
// 	headers: {
// 		"content-type": "application/json",
// 	},
// 	body: JSON.stringify({
// 		userName: values.UserName,
// 		nickName: values.NickName,
// 		password: values.Password,
// 		email: values.Email,
// 		captcha: values.Captcha,
// 	}),
// });

export const Fetch = (
	input: RequestInfo | URL,
	init?: TRequestInit
): Promise<Response> => {
	if (init?.method?.toLowerCase() === "get") {
		if (typeof init.data === "object") {
			const query = Object.entries(init.data)
				.map(([key, value]) => `${key}=${value}`)
				.join("&");
			input += `?${query}`;
		}
	} else if (init?.method?.toLowerCase() === "post") {
		init.headers = {
			...init.headers,
			"content-type": "application/json",
		};
		if (typeof init.data === "object") {
			init.body = JSON.stringify(init.data);
		}
	}
	return fetch(input, init as RequestInit);
};
