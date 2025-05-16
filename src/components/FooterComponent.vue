<script setup>
defineProps({
	msg: String,
});
</script>

<template>
	<footer
		class="flex h-20 w-full items-center justify-center rounded-sm bg-amber-400"
	>
		<p class="font-bold text-white">{{ msg }}</p>
	</footer>
</template>

<style></style>
