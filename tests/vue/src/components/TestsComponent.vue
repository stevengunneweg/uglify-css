<script setup>
import { ref } from 'vue';

defineProps({
	stringModifiers: String,
	dynamicModifiers: String,
});
const typescriptClasses = ref('bg-primary dark:bg-secondary');
</script>

<template>
	<div
		class="my-4 flex items-center justify-center rounded-md text-white"
		:class="
			typescriptClasses + ' ' + stringModifiers + ' ' + dynamicModifiers
		"
	>
		This component is used to test correct CSS uglification.
	</div>
</template>

<style></style>
