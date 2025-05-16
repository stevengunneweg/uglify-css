<script setup>

import { ref } from 'vue';

defineProps({
	showBlurb: Boolean,
});

const showBlurb = ref(false);

const participants = [
	{
		title: "First Row",
		people: [
			{ name: "Irving Langmuir", link: "https://en.wikipedia.org/wiki/Irving_Langmuir" },
			{ name: "Max Planck", link: "https://en.wikipedia.org/wiki/Max_Planck" },
			{ name: "Madame Curie", link: "https://en.wikipedia.org/wiki/Marie_Curie" },
			{ name: "Hendrik Lorentz", link: "https://en.wikipedia.org/wiki/Hendrik_Lorentz" },
			{ name: "Albert Einstein", link: "https://en.wikipedia.org/wiki/Albert_Einstein" },
			{ name: "Paul Langevin", link: "https://en.wikipedia.org/wiki/Paul_Langevin" },
			{ name: "Charles-Édouard Guye", link: "https://en.wikipedia.org/wiki/Charles_Edouard_Guye" },
			{ name: "Charles Wilson", link: "https://en.wikipedia.org/wiki/Charles_T_R_Wilson" },
			{ name: "Owen Richardson", link: "https://en.wikipedia.org/wiki/Owen_Richardson" }
		]
	},
	{
		title: "Second Row",
		people: [
			{ name: "Peter Debye", link: "https://en.wikipedia.org/wiki/Peter_Debey" },
			{ name: "Martin Knudsen", link: "https://en.wikipedia.org/wiki/Martin_Knudsen" },
			{ name: "William Henry Bragg", link: "https://en.wikipedia.org/wiki/William_Henry_Bragg" },
			{ name: "Hendrik Kramers", link: "https://en.wikipedia.org/wiki/Hendrik_Antoon_Kramers" },
			{ name: "Paul Dirac", link: "https://en.wikipedia.org/wiki/Paul_Dirac" },
			{ name: "Arthur Compton", link: "https://en.wikipedia.org/wiki/Arthur_Compton" },
			{ name: "Louis de Broglie", link: "https://en.wikipedia.org/wiki/Louis_de_Broglie" },
			{ name: "Max Born", link: "https://en.wikipedia.org/wiki/Max_Born" },
			{ name: "Niels Bohr", link: "https://en.wikipedia.org/wiki/Niels_Bohr" }
		]
	},
	{
		title: "Third Row",
		people: [
			{ name: "Auguste Piccard", link: "https://en.wikipedia.org/wiki/Auguste_Piccard" },
			{ name: "Emile Henriot", link: "https://en.wikipedia.org/wiki/Emile_Henriot" },
			{ name: "Paul Ehrenfest", link: "https://en.wikipedia.org/wiki/Paul_Ehrenfest" },
			{ name: "Théophile Herzen", link: "https://en.wikipedia.org/wiki/Th%C3%A9ophile_Herzen" },
			{ name: "Théophile de Donder", link: "https://en.wikipedia.org/wiki/Th%C3%A9ophile_de_Donder" },
			{ name: "Erwin Schrödinger", link: "https://en.wikipedia.org/wiki/Erwin_Schr%C3%B6dinger" },
			{ name: "Gustav Verschaffelt", link: "https://en.wikipedia.org/wiki/Gustav_Verschaffelt" },
			{ name: "Wolfgang Pauli", link: "https://en.wikipedia.org/wiki/Wolfgang_Pauli" },
			{ name: "Werner Heisenberg", link: "https://en.wikipedia.org/wiki/Werner_Heisenberg" },
			{ name: "Ralph Fowler", link: "https://en.wikipedia.org/wiki/Ralph_H._Fowler" },
			{ name: "Léon Brillouin", link: "https://en.wikipedia.org/wiki/L%C3%A9on_Brillouin" }
		]
	}
];
</script>

<template>
	<section class="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 mt-0">
		<div class="max-w-4xl mx-auto px-4 py-8">
			<div class="flex flex-col items-center gap-6">
				<div class="relative group saturate-0 hover:saturate-100 transition-all duration-1000 ease-in-out">
					<img
						src="../assets/images/photo.jpg"
						alt="Solvay 1927"
						class="w-full max-w-2xl h-auto rounded-3xl shadow-2xl ease-in-out group-hover:scale-105 transition-transform duration-1000"
					>
					<div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl">
						<div class="absolute bottom-4 left-4 text-white">
							<h2 class="text-4xl font-bold mb-2">Solvay Conference 1927</h2>
							<p class="text-lg">Fifth International Solvay Conference on Physics</p>
						</div>
					</div>
				</div>

				<div class="text-center space-y-4">
					<h2 class="text-3xl font-bold text-white">The Giants of Physics</h2>
					<p class="text-gray-400 max-w-2xl mx-auto">
						The most famous gathering of physicists in history, where the foundations of quantum mechanics were discussed.
					</p>
					<p v-if="showBlurb" class="text-gray-400 max-w-2xl mx-auto">
						This is some additional text that can be hidden or shown.
						<span class="text-red-500">This text is red.</span>
					</p>
				</div>
			</div>

			<section class="mt-12">
				<div class="bg-gray-800 rounded-2xl overflow-hidden shadow-xl">
					<div class="p-4 lg:p-6">
						<h3 class="text-2xl font-bold text-white mb-8">Participants</h3>

						<div class="space-y-8">
							<div v-for="(row, index) in participants" :key="index">
								<h4 class="text-xl font-semibold text-gray-300 mb-4">{{ row.title }}</h4>
								<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-4">
									<a
										v-for="person in row.people"
										:key="person.name"
										:href="person.link"
										target="_blank"
										class="bg-gray-700 hover:bg-gray-600 transition-colors duration-300 rounded-lg p-4 text-center"
									>
										<span class="block text-white font-medium">{{ person.name }}</span>
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	</section>
</template>

<style>
</style>