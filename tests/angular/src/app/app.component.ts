import { Component } from '@angular/core';
import { ButtonComponent } from './components/button/button.component';
import { CardComponent } from './components/card/card.component';
import { FillerComponent } from './components/filler/filler.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	imports: [
		ButtonComponent,
		CardComponent,
		FillerComponent,
		FooterComponent,
		HeaderComponent,
	],
})
export class AppComponent {
	title = 'Angular';
}
