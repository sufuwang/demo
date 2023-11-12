<template>
	<Write v-if="isHome" />
	<Read v-else />
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import Write from "./components/Write.vue";
import Read from "./components/Read.vue";

const isHome = ref(false);

onBeforeMount(() => {
	const { pathname } = window.location;
	if (pathname === "/") {
		isHome.value = true;
	}
});
</script>
