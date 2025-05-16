<script setup>
defineProps({
	cardTitle: String,
});
</script>

<template>
	<section class="my-4">
		<div class="w-32 rounded-sm bg-emerald-500">
			<h2 class="font-bold">{{ cardTitle }}</h2>
			<p class="text-white">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero
				tempore commodi sequi?
			</p>
		</div>
	</section>
</template>

<style></style>
