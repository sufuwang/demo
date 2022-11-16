import { Buffer } from "buffer";
import crypto from "crypto";
import http from "http";

export const secretKey = (header: http.IncomingHttpHeaders) => {
	const key = header["sec-websocket-key"];
	const MagicStr = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
	return crypto
		.createHash("sha1")
		.update(key + MagicStr)
		.digest("base64");
};

const parsePayloadWithMask = (payload: Buffer, maskStartIndex: number) => {
	const mask = payload.slice(maskStartIndex, maskStartIndex + 4);
	const data = payload.slice(maskStartIndex + 4);
	const len = data.length;
	const buffer = Buffer.alloc(len);
	for (let i = 0; i < len; i++) {
		buffer.writeUInt8(mask[i % 4] ^ data[i], i);
	}
	return buffer.toString("utf8");
};
export const parsePayload = (payload: Buffer): string => {
	const [f1, f2] = [...payload.slice(0, 2)].map((d) => d.toString(2));
	const opcode = parseInt(f1.slice(4), 2);
	const isMask = parseInt(f2.slice(0, 1), 2);
	const len = parseInt(f2.slice(1), 2);

	console.info(len);
	if (len < 126) {
		return parsePayloadWithMask(payload, 2);
	} else if (len === 126) {
		return parsePayloadWithMask(payload, 4);
	} else if (len === 127) {
		return parsePayloadWithMask(payload, 8);
	}
	return "";
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
