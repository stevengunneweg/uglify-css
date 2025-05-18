import { globSync } from 'glob';
import { readFileSync, writeFileSync } from 'node:fs';

const colorReset = '\x1b[0m';
const colorFgBlue = '\x1b[34m';
const colorFgGreen = '\x1b[32m';
const colorFgRed = '\x1b[31m';

if (process.argv.includes('-h') || process.argv.includes('--help')) {
	console.log(
		`Usage: node tools/scripts/uglify-css.js [--help | -h] [--dry-run | -d]
  -h, --help:		Show this help message and exit.
  -d, --dry-run:	Only show the changes that would be made, without actually modifying the files.
`,
	);
	process.exit(0);
}
const dryRun =
	process.argv.includes('--d') || process.argv.includes('--dry-run');

class Extractor {
	_files = [];
	classNames = [];
	cssVariables = [];

	constructor() {
		this._files = files;
	}

	extract() {
		this._files.forEach((file) => {
			const fileContents = readFileSync(file, 'utf-8');
			const contentsWithoutComments = fileContents.replaceAll(
				/\/(\*)+.*(?=\*\/)\*\/|\/\/.*$/gm,
				'',
			);

			// Match only valid CSS class names
			const matches = contentsWithoutComments.match(
				/\.(?:[a-zA-Z0-9-_\\\/]|\\:)*-(?:[a-zA-Z0-9-_\\\/]|\\:)+(?=\s|\:|\{)/gm,
			);
			if (matches) {
				// Remove the leading . for each class name
				const cleanMatches = matches.map((match) => match.slice(1));
				this.classNames.push(...cleanMatches);
			}

			// Match only valid CSS variables
			const variableMatches = contentsWithoutComments.match(
				/\--[a-zA-Z0-9-]*(?=\:)/g,
			);
			if (variableMatches) {
				this.cssVariables.push(...variableMatches);
			}
		});
		const uniqeClassNames = [...new Set(this.classNames)];
		const uniqeVariableNames = [...new Set(this.cssVariables)];
		return {
			classes: uniqeClassNames,
			variables: uniqeVariableNames,
		};
	}
}

class Uglifier {
	_blacklist = [];
	_mapping = {};
	_uglies = [];
	_supportedChars = [
		...'abcdefghijklmnopqrstuvwxyz',
		...'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
	];
	_additionalChars = [...'0123456789'];

	constructor(blacklist = []) {
		this._blacklist = blacklist;
	}

	uglifyValue(value, prefix = '') {
		const mapKey = `${prefix}${value}`;
		if (this._mapping[mapKey]) {
			return this._mapping[mapKey];
		}

		const defaultCharset = this._supportedChars;
		const extendedCharset = [
			...this._supportedChars,
			...this._additionalChars,
		];

		let n = this._uglies.length;
		let result = '';
		result = defaultCharset[n % defaultCharset.length];
		n = Math.floor((n - defaultCharset.length) / defaultCharset.length);

		while (
			n > 0 ||
			(result.length <= 1 && this._uglies.length >= defaultCharset.length)
		) {
			result += extendedCharset[n % extendedCharset.length];
			n = Math.floor(n / extendedCharset.length);
		}
		let uglyValue = `${prefix}${result}`;

		// Check if value is already present in extracted values
		if (this._blacklist.includes(uglyValue)) {
			console.log(
				`Value ${uglyValue} is blacklisted, skipping uglification.`,
			);
			this._uglies.push(uglyValue);
			return this.uglifyValue(value, prefix);
		}

		// Prevent duplicate ugly values
		if (this._uglies.includes(uglyValue)) {
			uglyValue = `${uglyValue}-${Math.floor(Math.random() * 1000)}`;
		}
		// If ugly value does not provide improvement, use the original value
		if (uglyValue.length > mapKey.length) {
			uglyValue = mapKey;
		}
		this._uglies.push(uglyValue);
		this._mapping[mapKey] = uglyValue;

		return uglyValue;
	}
}

class Replacer {
	filesPaths = [];
	files = {};
	fileSizes = {};

	constructor() {
		this.filesPaths = globSync('dist/**/*.{css,js,html}');
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
			// Only replace classes and variables, not values
			let prefix = '';
			if (file.endsWith('.css') && !value.startsWith('--')) {
				prefix = '.';
			}
			this.files[file] = contents
				.replaceAll(`${prefix}${value}`, `${prefix}${uglyValue}`)
				// Also replace non-escaped implementations
				.replaceAll(
					`${prefix}${value}`.replaceAll('\\', ''),
					`${prefix}${uglyValue}`.replaceAll('\\', ''),
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

const files = globSync('dist/**/*.css');
const extractor = new Extractor(files);
const { classes, variables } = extractor.extract();
const replacer = new Replacer();

let mapping = {};
// Give each type its own uglifier to reuse shortest values
// @NOTE: Variables need to be handled first
[variables, classes].forEach((list) => {
	const uglifier = new Uglifier(list);
	// @TODO: Detect most used and give it shortest replacement name
	// In order to do this, we need to count the number of times a class is used throughout the dist folder
	const replaceables = [...list].sort((a, b) => {
		if (a.length > b.length) {
			return -1;
		} else if (a.length < b.length) {
			return 1;
		}
		return 0;
	});
	replaceables.forEach((className) => {
		const uglyValue = uglifier.uglifyValue(
			`${className}`.replace(/^--/g, ''),
			className.startsWith('--') ? '--' : '',
		);
		replacer.parse(className, uglyValue);
	});
	mapping = { ...mapping, ...uglifier._mapping };
});
replacer.replaceFiles(dryRun);

const mappingSorted = Object.entries(mapping)
	.sort((a, b) => {
		if (a[0] < b[0]) {
			return -1;
		} else if (a[0] > b[0]) {
			return 1;
		}
		return 0;
	})
	.reduce((cummulative, [key, value]) => {
		cummulative[key] = value;
		return cummulative;
	}, {});
console.log('mapping', mappingSorted);
console.log('----------------------------------');
console.log('Uglified CSS classes and variables');
console.log('See mapping above');
Object.entries(replacer.fileSizes).forEach(([file, sizes]) => {
	let color = '';
	if (sizes.old > sizes.new) {
		color = colorFgGreen;
	} else if (sizes.old < sizes.new) {
		color = colorFgRed;
	}
	console.log(
		`${colorFgBlue}${file}${colorReset} - ${sizes.old} -> ${sizes.new} ${color}(${sizes.old === sizes.new ? '' : sizes.old > sizes.new ? '-' : '+'}${Math.abs(sizes.optimised)}%)${colorReset}`,
	);
});
