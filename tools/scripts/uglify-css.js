import { globSync } from 'glob';
import { readFileSync, writeFileSync } from 'node:fs';

const files = globSync('dist/**/*.css');

const classNames = [];
const cssVariables = [];
files.forEach((file) => {
	const fileContents = readFileSync(file, 'utf-8');
	const contentsWithoutComments = fileContents.replace(/\/\*.*?\*\//gs, '');

	// Match only valid CSS class names
	const matches = contentsWithoutComments.match(
		/\.[a-zA-Z0-9-_:\\]*-[a-zA-Z0-9-_:\\]+(?=\{)/g,
	);
	if (matches) {
		// Remove the leading . for each class name
		const cleanMatches = matches.map((match) => match.slice(1));
		classNames.push(...cleanMatches);
	}

	// Match only valid CSS variables
	const variableMatches = contentsWithoutComments.match(
		/\--[a-zA-Z0-9-]*(?=\:)/g,
	);
	if (variableMatches) {
		cssVariables.push(...variableMatches);
	}
});

const sortedClassNames = classNames.sort();
const uniqeClassNames = [...new Set(sortedClassNames)];
const uniqeVariableNames = [...new Set(cssVariables)];

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
		const uglyValue = `${prefix}${result}`;

		if (this._uglies.includes(uglyValue)) {
			return `${uglyValue}-${Math.floor(Math.random() * 1000)}`;
		}
		this._uglies.push(uglyValue);
		this._mapping[mapKey] = uglyValue;
		return uglyValue;
	}
}

class Replacer {
	filesPaths = [];
	files = {};

	constructor() {
		this.filesPaths = globSync('dist/**/*.{css,js,html}');
		this.files = {};

		this.filesPaths.forEach((file) => {
			const fileContents = readFileSync(file, 'utf-8');
			if (!this.files[file]) {
				this.files[file] = fileContents;
			}
		});
	}

	/* Replace value with uglified version */
	parse(value, uglyValue) {
		Object.entries(this.files).forEach(([file, contents]) => {
			this.files[file] = contents.replaceAll(value, uglyValue);
		});
	}

	/* Replace file with new value */
	replaceFiles() {
		Object.entries(this.files).forEach(([file, contents]) => {
			writeFileSync(file, contents, 'utf-8');
		});
	}
}

const uglifier = new Uglifier();
const replacer = new Replacer();

const replaceables = [...uniqeClassNames, ...uniqeVariableNames].sort(
	(a, b) => {
		if (a.length > b.length) {
			return -1;
		} else if (a.length < b.length) {
			return 1;
		}
		return 0;
	},
);

replaceables.forEach((className) => {
	const uglyValue = uglifier.uglifyValue(
		`${className}`.replace(/^--/g, ''),
		className.startsWith('--') ? '--' : '',
	);
	replacer.parse(className, uglyValue);
});
replacer.replaceFiles();

console.log('mapping', uglifier._mapping);
console.log('----------------------------------');
console.log('Uglified CSS classes and variables');
console.log('See mapping above');
