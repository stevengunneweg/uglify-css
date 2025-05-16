<script setup>
import Filler from './components/filler.vue';
import FooterComponent from './components/FooterComponent.vue';
import HeaderComponent from './components/HeaderComponent.vue';
import CardComponent from './components/CardComponent.vue';
import ButtonComponent from './components/ButtonComponent.vue';
</script>

<template>
	<HeaderComponent title="Uglify Tailwind CSS" />

	<div class="flex justify-center gap-2">
		<a href="https://vite.dev" target="_blank">
			<img src="/vite.svg" class="logo" alt="Vite logo" />
		</a>
		<a href="https://vuejs.org/" target="_blank">
			<img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
		</a>
	</div>
	<Filler />
	<div class="flex flex-wrap justify-center gap-2">
		<CardComponent cardTitle="Card Title" />
		<CardComponent cardTitle="Card Title 2" />
		<CardComponent cardTitle="Card Title 3" />
	</div>

	<ButtonComponent buttonText="Button" />
	<FooterComponent msg="Footer" />
</template>

<style scoped>
</style>
