import { Button, Row, Col, Form, Input } from "antd";
import { Fetch } from "../../utils/tools";
import { useCallback, useEffect } from "react";

type FieldType = {
	UserName: string;
	NickName: string;
	Password: string;
	Email: string;
	Captcha: string;
};

const tailFormItemLayout = {
	wrapperCol: {
		xs: {
			span: 24,
			offset: 0,
		},
		sm: {
			span: 16,
			offset: 8,
		},
	},
};

export default () => {
	const [form] = Form.useForm<FieldType>();

	const getCaptcha = useCallback(async () => {
		const { Captcha, ...values } = form.getFieldsValue();
		const fields = Object.keys(values);
		await form.validateFields(fields);
		Fetch("http://localhost:3000/user/captcha.get", {
			method: "GET",
			data: { email: values.Email },
		});
		console.info("date: ", Date.now());
	}, [form]);

	useEffect(() => {
		const event = new EventSource("http://localhost:3000/stream");
		event.onmessage = (data: any) => {
			console.info("data:", data);
		};
		return () => {
			event.onmessage = null;
		};
	}, []);

	const onFinish = (values: FieldType) => {
		Fetch("http://localhost:3000/user/register", {
			method: "POST",
			data: {
				userName: values.UserName,
				nickName: values.NickName,
				password: values.Password,
				email: values.Email,
				captcha: values.Captcha,
			},
		});
	};

	return (
		<Form
			form={form}
			labelCol={{ span: 8 }}
			wrapperCol={{ span: 16 }}
			style={{ maxWidth: 600 }}
			onFinish={onFinish}
			autoComplete="off"
		>
			Date.now() = {Date.now()}
			<Form.Item<FieldType>
				label="UserName"
				name="UserName"
				rules={[{ required: true }]}
			>
				<Input />
			</Form.Item>
			<Form.Item<FieldType>
				label="NickName"
				name="NickName"
				rules={[{ required: true }]}
			>
				<Input />
			</Form.Item>
			<Form.Item<FieldType>
				label="Password"
				name="Password"
				rules={[{ required: true }]}
			>
				<Input />
			</Form.Item>
			<Form.Item<FieldType>
				label="Email"
				name="Email"
				rules={[
					{ type: "email", message: "The input is not valid E-mail!" },
					{ required: true },
				]}
			>
				<Input />
			</Form.Item>
			<Form.Item<FieldType>
				label="Captcha"
				name="Captcha"
				rules={[{ required: true }]}
			>
				<Row gutter={8}>
					<Col span={16}>
						<Input />
					</Col>
					<Col span={6}>
						<Button onClick={getCaptcha}>Get captcha</Button>
					</Col>
				</Row>
			</Form.Item>
			<Form.Item {...tailFormItemLayout}>
				<Button type="primary" htmlType="submit">
					Register
				</Button>
			</Form.Item>
		</Form>
	);
};
