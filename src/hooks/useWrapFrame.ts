const STATE = {
	mask: Buffer.alloc(0),
	payload: Buffer.alloc(0),
	length: Infinity,
	isWorking: false,
};

// 合并多个帧
const useWrapFrame = () => {
	const push = (payload: Buffer) => {
		const buffer = Buffer.alloc(payload.length + STATE.payload.length);
		STATE.payload.copy(buffer, 0);
		payload.copy(buffer, STATE.payload.length);
		STATE.isWorking = true;
		STATE.payload = buffer;
		STATE.isWorking = STATE.length > buffer.length;
	};
	const clear = () => {
		STATE.mask = Buffer.alloc(0);
		STATE.payload = Buffer.alloc(0);
		STATE.length = Infinity;
		STATE.isWorking = false;
	};

	return {
		push,
		clear,
		getPayload() {
			return STATE.payload;
		},
		getIsWorking() {
			return STATE.isWorking;
		},
		getMask() {
			return STATE.mask;
		},
		setMask(mask: Buffer) {
			STATE.mask = mask;
		},
		getLen() {
			return STATE.length;
		},
		setLen(len: number) {
			STATE.length = len;
		},
	};
};

export default useWrapFrame;
