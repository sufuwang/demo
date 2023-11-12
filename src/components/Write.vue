<template>
	<t-space direction="horizontal">
		<t-button theme="default" variant="base" @click="openNewPage">
			Go To Page
		</t-button>
		<t-radio-group variant="default-filled" v-model="type">
			<t-radio-button value="Storage">Storage</t-radio-button>
			<t-radio-button value="WebWorker">Web Worker</t-radio-button>
		</t-radio-group>
	</t-space>
	data = {{ data }}
	<br />
	<template v-if="type === 'WebWorker'">
		Console of Worker => chrome://inspect/#workers
	</template>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive } from "vue";
import { Storage, Worker, Key, getRandomCount } from "../tools";

const id = ref();
const data = reactive({ storage: "", webWorker: "" });
const type = ref<"Storage" | "WebWorker">("WebWorker");

const openNewPage = () => {
	window.open("/home", "PageName");
};

onMounted(() => {
	id.value = setInterval(() => {
		data.storage = getRandomCount();
		data.webWorker = getRandomCount();
		sessionStorage.setItem(Key.storage, data.storage);
		sessionStorage.setItem(Key.webWorker, data.webWorker);
		if (type.value === "Storage") {
			Storage.startSync();
			Worker.endSync();
		} else {
			Worker.startSync();
		}
	}, 1000);
});
onUnmounted(() => {
	clearInterval(id.value);
});
</script>
<script lang="scss" scoped></script>
