import { ContextOptions } from './context';

export class Logger {
	private context: ContextOptions;

	constructor(context: ContextOptions) {
		this.context = context;
	}

	log(...args: any) {
		if (this.context.silent) {
			return;
		}
		console.log(...args);
	}
}
