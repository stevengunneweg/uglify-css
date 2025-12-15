export class Context {
	colorReset = '\x1b[0m';
	colorFgBlue = '\x1b[34m';
	colorFgGreen = '\x1b[32m';
	colorFgRed = '\x1b[31m';

	dryRun;
	verbose;
	silent;
	path;
	algorithm;
	canUseUppercase;
	skipClasses;

	constructor(dryRun, verbose, silent, path, algorithm, skipClasses) {
		this.dryRun = dryRun;
		this.verbose = verbose;
		this.silent = silent;
		this.path = path;
		this.algorithm = algorithm || 'length';
		this.canUseUppercase = false;
		this.skipClasses = skipClasses;
	}
}
