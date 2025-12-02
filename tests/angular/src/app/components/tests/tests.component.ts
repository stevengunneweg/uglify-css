import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
	selector: 'app-tests',
	templateUrl: './tests.component.html',
	imports: [NgClass],
})
export class TestsComponent {
	stringModifiers = input('');
	dynamicModifiers = input('');

	typescriptClasses = 'bg-primary dark:bg-secondary';
}
