import { Component, input } from '@angular/core';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
})
export class HeaderComponent {
	title = input('');
}
