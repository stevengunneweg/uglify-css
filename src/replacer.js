import { globSync } from 'glob';
import { readFileSync, writeFileSync } from 'node:fs';

export class Replacer {
	context;
	filesPaths = [];
	files = {};
	fileSizes = {};

	constructor(context) {
		this.context = context;

		this.filesPaths = globSync(`${this.context.path}/**/*.{css,js,html}`);
		this.files = {};

		this.filesPaths.forEach((file) => {
			const fileContents = readFileSync(file, 'utf-8');
			if (!this.files[file]) {
				this.files[file] = fileContents;
			}
			if (!this.fileSizes[file]) {
				this.fileSizes[file] = { old: fileContents.length };
			}
		});
	}

	/* Replace value with uglified version */
	parse(value, uglyValue) {
		Object.entries(this.files).forEach(([file, contents]) => {
			const fileExtension = file.split('.').pop();

			// Only replace classes and variables, not values
			let regexPrefix = '';
			if (!value.startsWith('--')) {
				switch (fileExtension) {
					case 'css':
						regexPrefix = '(?<=\\.)';
						break;
					case 'html':
						regexPrefix = '(?<=[^:][\\s".])';
						break;
					case 'js':
						regexPrefix =
							'(?<!var\\(--[\\-a-zA-Z0-9]*,[\\s]?)(?<=[^:]|[\\s"\'`.])';
						break;
				}
			}
			this.files[file] = contents.replaceAll(
				new RegExp(
					`${regexPrefix}${value.replaceAll(
						/[:\\\/]/g,
						'[:\\\\\\\/]*',
					)}`,
					'gm',
				),
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
						100,
				) / 100;
			this.fileSizes[file].optimised = optimisePercentage;
		});

		if (!dryRun) {
			Object.entries(this.files).forEach(([file, contents]) => {
				writeFileSync(file, contents, 'utf-8');
			});
		}
	}
}
