<script setup>
import ButtonComponent from './components/ButtonComponent.vue';
import CardComponent from './components/CardComponent.vue';
import Filler from './components/FillerComponent.vue';
import FooterComponent from './components/FooterComponent.vue';
import HeaderComponent from './components/HeaderComponent.vue';
import TestsComponent from './components/TestsComponent.vue';
</script>

<template>
	<HeaderComponent title="Uglify Tailwind CSS" />
	<TestsComponent stringModifiers="p-4" :dynamicModifiers="'w-full'" />
	<Filler />
	<div class="flex flex-wrap justify-center gap-2">
		<CardComponent cardTitle="Card Title" />
		<CardComponent cardTitle="Card Title 2" />
		<CardComponent cardTitle="Card Title 3" />
	</div>
	<ButtonComponent buttonText="Button" />
	<FooterComponent msg="Footer" />
</template>
