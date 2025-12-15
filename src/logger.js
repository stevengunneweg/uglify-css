export class Logger {
	constructor(context) {
		this.context = context;
	}

	log(args) {
		if (this.context.silent) {
			return;
		}
		console.log(args);
	}
}
