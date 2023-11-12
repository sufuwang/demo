<template>data = {{ data }}</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive } from "vue";
import { Storage, Worker, Key } from "../tools";

const id = ref();
const data = reactive({ storage: "", webWorker: "" });

onMounted(() => {
	Worker.listener();
	id.value = setInterval(() => {
		Storage.sync();
		Worker.sync();
		data.storage = sessionStorage.getItem(Key.storage) ?? "";
		data.webWorker = sessionStorage.getItem(Key.webWorker) ?? "";
	}, 500);
});
onUnmounted(() => {
	clearInterval(id.value);
});
</script>
<script lang="scss" scoped></script>
