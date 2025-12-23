import { globSync } from 'glob';
import { readFileSync, writeFileSync } from 'node:fs';
import { ContextOptions } from './context';
import { getTokenRegex } from './helpers/token-regex';

export class Replacer {
	context: ContextOptions;
	files: { [key: string]: string } = {};
	fileSizes: {
		[key: string]: { old: number; new: number; optimised: number };
	} = {};

	constructor(context: ContextOptions) {
		this.context = context;

		const filesPaths = globSync(
			`${this.context.path}/**/*.{css,js,mjs,html}`,
		);
		const files: { [key: string]: string } = {};

		filesPaths.forEach((file) => {
			const fileContents = readFileSync(file, 'utf-8');
			// istanbul ignore else -- @preserve
			if (!files[file]) {
				files[file] = fileContents;
			}
			// istanbul ignore else -- @preserve
			if (!this.fileSizes[file]) {
				this.fileSizes[file] = {
					old: fileContents.length,
					new: fileContents.length,
					optimised: 0,
				};
			}
		});
		this.files = files;
	}

	/* Replace value with uglified version */
	parse(value: string, uglyValue: string) {
		Object.entries(this.files).forEach(([file, contents]) => {
			const fileExtension = file.split('.').pop() as string;
			this.files[file] = contents.replaceAll(
				getTokenRegex(value, fileExtension),
				uglyValue,
			);
		});
	}

	/* Replace file with new value */
	replaceFiles(dryRun = false) {
		Object.keys(this.files).forEach((file) => {
			this.fileSizes[file].new = this.files[file].length;
			const optimisePercentage =
				Math.round(
					(100 -
						(100 / this.fileSizes[file].old) *
							this.fileSizes[file].new) *
						1000,
				) / 1000;
			this.fileSizes[file].optimised = optimisePercentage;
		});

		if (!dryRun) {
			Object.entries(this.files).forEach(([file, contents]) => {
				writeFileSync(file, contents, 'utf-8');
			});
		}
	}
}
