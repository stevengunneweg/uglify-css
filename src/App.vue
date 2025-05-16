<script setup>
import HelloWorld from './components/HelloWorld.vue';
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
	<HelloWorld msg="Vite + Vue" />
	<div class="flex flex-wrap justify-center gap-2">
		<CardComponent cardTitle="Card Title" />
		<CardComponent cardTitle="Card Title 2" />
		<CardComponent cardTitle="Card Title 3" />
	</div>

	<ButtonComponent buttonText="Button" />
	<FooterComponent msg="Footer" />
</template>

<style scoped>
.logo {
	height: 6em;
	padding: 1.5em;
	will-change: filter;
	transition: filter 300ms;
}
.logo:hover {
	filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
	filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
