import { Buffer } from "buffer";
import crypto from "crypto";
import http from "http";
import useWrapFrame from "./hooks/useWrapFrame";

export const OPCODE = {
	0: "CONTINUE",
	1: "TEXT",
	2: "BINARY",
	8: "CLOSE",
	9: "PING",
	10: "PONG",
	CONTINUE: "CONTINUE",
	TEXT: "TEXT",
	BINARY: "BINARY",
	CLOSE: "CLOSE",
	PING: "PING",
	PONG: "PONG",
};
export interface TypeOPCODE {
	0: "CONTINUE";
	1: "TEXT";
	2: "BINARY";
	8: "CLOSE";
	9: "PING";
	10: "PONG";
	CONTINUE: "CONTINUE";
	TEXT: "TEXT";
	BINARY: "BINARY";
	CLOSE: "CLOSE";
	PING: "PING";
	PONG: "PONG";
}
export type TypeFrameOPCODE = TypeOPCODE["TEXT"] | TypeOPCODE["BINARY"];

export const secretKey = (header: http.IncomingHttpHeaders) => {
	const key = header["sec-websocket-key"];
	const MagicStr = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
	return crypto
		.createHash("sha1")
		.update(key + MagicStr)
		.digest("base64");
};

const parsePayloadWithMask = (
	mask: Buffer,
	data: Buffer,
	type: TypeFrameOPCODE
) => {
	console.info("type: ", type);
	const buffer = [];
	for (let i = 0; i < data.length; i++) {
		buffer.push(mask[i % 4] ^ data[i]);
	}
	if (type === "BINARY") {
		return buffer.join("");
	}
	return Buffer.from(buffer).toString("utf8");
};
const parseFlagFromPayload = (payload: Buffer) => {
	const [f1, [maskCode, ...payloadLenCode]] = [...payload.slice(0, 2)].map(
		(d) => d.toString(2).padStart(8, "0")
	);
	const opcode = OPCODE[
		parseInt(f1.slice(4), 2) as keyof TypeOPCODE
	] as TypeOPCODE[keyof TypeOPCODE];
	const isWithMask = maskCode === "1";
	const payloadLenFlag = parseInt(payloadLenCode.join(""), 2);
	const payloadLenRange = [
		1,
		payloadLenFlag < 126 ? 2 : payloadLenFlag === 126 ? 4 : 10,
	];
	const maskLen = 4;
	const totalPayloadLen =
		payloadLenFlag >= 126
			? parseInt(
					[...payload.slice(2, payloadLenRange[1])]
						.map((d) => d.toString(2).padStart(8, "0"))
						.join(""),
					2
			  )
			: payloadLenFlag;
	const curPayload = payload.slice(payloadLenRange[1] + maskLen);
	const curPayloadLen = curPayload.length;
	return {
		isFinal: totalPayloadLen === curPayloadLen,
		opcode,
		isWithMask,
		mask: payload.slice(payloadLenRange[1], payloadLenRange[1] + maskLen),
		curPayload,
		totalPayloadLen,
		curPayloadLen,
		payloadLenFlag,
		payloadLenRange,
	};
};

const Frame = useWrapFrame();
export const parsePayload = (payload: Buffer): string => {
	if (Frame.getIsWorking()) {
		// 后续帧
		Frame.push(payload);
	} else {
		// 第一个帧
		const flag = parseFlagFromPayload(payload);
		if (![OPCODE.TEXT, OPCODE.BINARY].includes(flag.opcode)) {
			console.info("OPCODE: ", flag.opcode);
			return "";
		}
		Frame.setType(flag.opcode as TypeFrameOPCODE);
		Frame.setMask(flag.mask);
		Frame.setLen(flag.totalPayloadLen);
		Frame.push(flag.curPayload);
	}
	if (Frame.getIsWorking()) {
		return "";
	}
	const str = parsePayloadWithMask(
		Frame.getMask(),
		Frame.getPayload(),
		Frame.getType()
	);
	Frame.clear();
	return str;
};

export const wrapPayload = (payload: string): Buffer => {
	const len = payload.length;
	let buffer: Buffer = null!;
	if (len < 126) {
		buffer = Buffer.alloc(len + 2);
		buffer.writeUInt8(129, 0);
		buffer.writeUInt8(len, 1);
		Buffer.from(payload).copy(buffer, 2);
	}
	return buffer;
};
