import { Component, input } from '@angular/core';

@Component({
	selector: 'app-button',
	templateUrl: './button.component.html',
})
export class ButtonComponent {
	buttonText = input('');
}
