import { Component, input } from '@angular/core';

@Component({
	selector: 'app-footer',
	templateUrl: './footer.component.html',
})
export class FooterComponent {
	msg = input('');
}
