<script setup>
import Filler from './components/filler.vue';
import FooterComponent from './components/FooterComponent.vue';
import HeaderComponent from './components/HeaderComponent.vue';
import CardComponent from './components/CardComponent.vue';
import ButtonComponent from './components/ButtonComponent.vue';
</script>

<template>
	<HeaderComponent title="Uglify Tailwind CSS" />
	<Filler />
	<div class="flex flex-wrap justify-center gap-2">
		<CardComponent cardTitle="Card Title" />
		<CardComponent cardTitle="Card Title 2" />
		<CardComponent cardTitle="Card Title 3" />
	</div>
	<ButtonComponent buttonText="Button" />
	<FooterComponent msg="Footer" />
</template>
