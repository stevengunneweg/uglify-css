import { Component, input } from '@angular/core';

@Component({
	selector: 'app-filler',
	templateUrl: './filler.component.html',
})
export class FillerComponent {
	showBlurb = input(false);

	participants = [
		{
			title: 'First Row',
			people: [
				{
					name: 'Irving Langmuir',
					link: 'https://en.wikipedia.org/wiki/Irving_Langmuir',
				},
				{
					name: 'Max Planck',
					link: 'https://en.wikipedia.org/wiki/Max_Planck',
				},
				{
					name: 'Madame Curie',
					link: 'https://en.wikipedia.org/wiki/Marie_Curie',
				},
				{
					name: 'Hendrik Lorentz',
					link: 'https://en.wikipedia.org/wiki/Hendrik_Lorentz',
				},
				{
					name: 'Albert Einstein',
					link: 'https://en.wikipedia.org/wiki/Albert_Einstein',
				},
				{
					name: 'Paul Langevin',
					link: 'https://en.wikipedia.org/wiki/Paul_Langevin',
				},
				{
					name: 'Charles-Édouard Guye',
					link: 'https://en.wikipedia.org/wiki/Charles_Edouard_Guye',
				},
				{
					name: 'Charles Wilson',
					link: 'https://en.wikipedia.org/wiki/Charles_T_R_Wilson',
				},
				{
					name: 'Owen Richardson',
					link: 'https://en.wikipedia.org/wiki/Owen_Richardson',
				},
			],
		},
		{
			title: 'Second Row',
			people: [
				{
					name: 'Peter Debye',
					link: 'https://en.wikipedia.org/wiki/Peter_Debey',
				},
				{
					name: 'Martin Knudsen',
					link: 'https://en.wikipedia.org/wiki/Martin_Knudsen',
				},
				{
					name: 'William Henry Bragg',
					link: 'https://en.wikipedia.org/wiki/William_Henry_Bragg',
				},
				{
					name: 'Hendrik Kramers',
					link: 'https://en.wikipedia.org/wiki/Hendrik_Antoon_Kramers',
				},
				{
					name: 'Paul Dirac',
					link: 'https://en.wikipedia.org/wiki/Paul_Dirac',
				},
				{
					name: 'Arthur Compton',
					link: 'https://en.wikipedia.org/wiki/Arthur_Compton',
				},
				{
					name: 'Louis de Broglie',
					link: 'https://en.wikipedia.org/wiki/Louis_de_Broglie',
				},
				{ name: 'Max Born', link: 'https://en.wikipedia.org/wiki/Max_Born' },
				{
					name: 'Niels Bohr',
					link: 'https://en.wikipedia.org/wiki/Niels_Bohr',
				},
			],
		},
		{
			title: 'Third Row',
			people: [
				{
					name: 'Auguste Piccard',
					link: 'https://en.wikipedia.org/wiki/Auguste_Piccard',
				},
				{
					name: 'Emile Henriot',
					link: 'https://en.wikipedia.org/wiki/Emile_Henriot',
				},
				{
					name: 'Paul Ehrenfest',
					link: 'https://en.wikipedia.org/wiki/Paul_Ehrenfest',
				},
				{
					name: 'Théophile Herzen',
					link: 'https://en.wikipedia.org/wiki/Th%C3%A9ophile_Herzen',
				},
				{
					name: 'Théophile de Donder',
					link: 'https://en.wikipedia.org/wiki/Th%C3%A9ophile_de_Donder',
				},
				{
					name: 'Erwin Schrödinger',
					link: 'https://en.wikipedia.org/wiki/Erwin_Schr%C3%B6dinger',
				},
				{
					name: 'Gustav Verschaffelt',
					link: 'https://en.wikipedia.org/wiki/Gustav_Verschaffelt',
				},
				{
					name: 'Wolfgang Pauli',
					link: 'https://en.wikipedia.org/wiki/Wolfgang_Pauli',
				},
				{
					name: 'Werner Heisenberg',
					link: 'https://en.wikipedia.org/wiki/Werner_Heisenberg',
				},
				{
					name: 'Ralph Fowler',
					link: 'https://en.wikipedia.org/wiki/Ralph_H._Fowler',
				},
				{
					name: 'Léon Brillouin',
					link: 'https://en.wikipedia.org/wiki/L%C3%A9on_Brillouin',
				},
			],
		},
	];
}
