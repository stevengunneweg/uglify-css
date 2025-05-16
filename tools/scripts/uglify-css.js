import { globSync } from 'glob';
import { readFileSync, writeFileSync } from 'node:fs';

const files = globSync('dist/**/*.css');

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
				/\/(\*)+([^\/])*(?=\*\/)/gm,
				'',
			);

			// Match only valid CSS class names
			const matches = contentsWithoutComments.match(
				/\.[a-zA-Z0-9-_:\\]*-[a-zA-Z0-9-_:\\]+(?=\{)/g,
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
	_mapping = {};
	_uglies = [];
	_supportedChars = [
		'a',
		'b',
		'c',
		'd',
		'e',
		'f',
		'g',
		'h',
		'i',
		'j',
		'k',
		'l',
		'm',
		'n',
		'o',
		'p',
		'q',
		'r',
		's',
		't',
		'u',
		'v',
		'w',
		'x',
		'y',
		'z',
		'A',
		'B',
		'C',
		'D',
		'E',
		'F',
		'G',
		'H',
		'I',
		'J',
		'K',
		'L',
		'M',
		'N',
		'O',
		'P',
		'Q',
		'R',
		'S',
		'T',
		'U',
		'V',
		'W',
		'X',
		'Y',
		'Z',
	];

	uglifyValue(value, prefix = '') {
		const mapKey = `${prefix}${value}`;
		if (this._mapping[mapKey]) {
			return this._mapping[mapKey];
		}

		let n = this._uglies.length;
		let result = '';
		do {
			result =
				this._supportedChars[n % this._supportedChars.length] + result;
			n = Math.floor(n / this._supportedChars.length) - 1;
		} while (n >= 0);
		let uglyValue = `${prefix}${result}`;
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
			this.files[file] = contents
				.replaceAll(value, uglyValue)
				// Also replace non-escaped implementations
				.replaceAll(
					value.replaceAll('\\', ''),
					uglyValue.replaceAll('\\', ''),
				);
		});
	}

	/* Replace file with new value */
	replaceFiles() {
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

		Object.entries(this.files).forEach(([file, contents]) => {
			writeFileSync(file, contents, 'utf-8');
		});
	}
}

const extractor = new Extractor(files);
const uglifier = new Uglifier();
const replacer = new Replacer();

const { classes, variables } = extractor.extract();
const replaceables = [...classes, ...variables].sort((a, b) => {
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
replacer.replaceFiles();

const mappingSorted = Object.entries(uglifier._mapping).sort((a, b) => {
	if (a[0] < b[0]) {
		return -1;
	} else if (a[0] > b[0]) {
		return 1;
	}
	return 0;
});
console.log('mapping', JSON.stringify(mappingSorted, null, 2));
console.log('----------------------------------');
console.log('Uglified CSS classes and variables');
console.log('See mapping above');
console.log(replacer.fileSizes);
