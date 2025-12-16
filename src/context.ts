export type Algorithm = 'length' | 'count' | 'countXlength';

export interface ContextOptions {
	readonly colorReset: string;
	readonly colorFgBlue: string;
	readonly colorFgGreen: string;
	readonly colorFgRed: string;

	dryRun: boolean;
	verbose: boolean;
	silent: boolean;
	path: string;
	algorithm: Algorithm;
	canUseUppercase: boolean;
	skipClasses: boolean;
}

export class Context {
	readonly colorReset = '\x1b[0m';
	readonly colorFgBlue = '\x1b[34m';
	readonly colorFgGreen = '\x1b[32m';
	readonly colorFgRed = '\x1b[31m';

	dryRun: boolean;
	verbose: boolean;
	silent: boolean;
	path: string;
	algorithm: Algorithm;
	canUseUppercase: boolean;
	skipClasses: boolean;

	constructor(config: {
		dryRun: boolean;
		verbose: boolean;
		silent: boolean;
		path: string;
		skipClasses: boolean;
		algorithm?: Algorithm;
	}) {
		this.dryRun = config.dryRun;
		this.verbose = config.verbose;
		this.silent = config.silent;
		this.path = config.path;
		this.algorithm = config.algorithm || 'length';
		this.canUseUppercase = false;
		this.skipClasses = config.skipClasses;
	}
}
