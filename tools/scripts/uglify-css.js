import { globSync } from 'glob';
import { readFileSync, writeFileSync } from 'node:fs';

const files = globSync('dist/**/*.css');
console.log(files);

const classNames = [];
files.forEach((file) => {
	const fileContents = readFileSync(file, 'utf-8');
    const contentsWithoutComments = fileContents.replace(/\/\*.*?\*\//gs, '');

	// Match only valid CSS class names
	const matches = contentsWithoutComments.match(/\.[a-zA-Z0-9-_:\\]*-[a-zA-Z0-9-_:\\]+(?=\{)/g);

    if (matches) {
        classNames.push(...matches);
    }
});

const sortedClassNames = classNames.sort();
const uniqeClassNames = [...new Set(sortedClassNames)];

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

	uglifyValue(value) {
		if (this._mapping[value]) {
			return this._mapping[value];
		}

		let n = this._uglies.length;
		let result = '';
		do {
			result =
				this._supportedChars[n % this._supportedChars.length] + result;
			n = Math.floor(n / this._supportedChars.length) - 1;
		} while (n >= 0);
		const uglyValue = `${result}`;

		if (this._uglies.includes(uglyValue)) {
			return `${uglyValue} - ${Math.floor(Math.random() * 1000)}`;
		}
		this._uglies.push(uglyValue);
		this._mapping[value] = uglyValue;
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

const classes = [
	'--tw-space-y-reverse',
	'--tw-gradient-position',
	'--tw-gradient-from',
	'--tw-gradient-via',
	'--tw-gradient-to',
	'--tw-gradient-stops',
	'--tw-gradient-via-stops',
	'--tw-gradient-from-position',
	'--tw-gradient-via-position',
	'--tw-gradient-to-position',
	'--tw-font-weight',
	'--tw-shadow',
	'--tw-shadow-color',
	'--tw-shadow-alpha',
	'--tw-inset-shadow',
	'--tw-inset-shadow-color',
	'--tw-inset-shadow-alpha',
	'--tw-ring-color',
	'--tw-ring-shadow',
	'--tw-inset-ring-color',
	'--tw-inset-ring-shadow',
	'--tw-ring-inset',
	'--tw-ring-offset-width',
	'--tw-ring-offset-color',
	'--tw-ring-offset-shadow',
	'--tw-blur',
	'--tw-brightness',
	'--tw-contrast',
	'--tw-grayscale',
	'--tw-hue-rotate',
	'--tw-invert',
	'--tw-opacity',
	'--tw-saturate',
	'--tw-sepia',
	'--tw-drop-shadow',
	'--tw-drop-shadow-color',
	'--tw-drop-shadow-alpha',
	'--tw-drop-shadow-size',
	'--tw-duration',
	'--tw-ease',
	'--tw-scale-x',
	'--tw-scale-y',
	'--tw-scale-z',
	'--font-sans',
	'--font-mono',
	'--color-red-100',
	'--color-red-500',
	'--color-red-600',
	'--color-red-700',
	'--color-red-800',
	'--color-red-900',
	'--color-green-100',
	'--color-green-200',
	'--color-green-300',
	'--color-green-400',
	'--color-green-500',
	'--color-green-600',
	'--color-green-700',
	'--color-green-800',
	'--color-green-900',
	'--color-blue-100',
	'--color-blue-200',
	'--color-blue-300',
	'--color-blue-400',
	'--color-blue-500',
	'--color-blue-600',
	'--color-blue-700',
	'--color-blue-800',
	'--color-blue-900',
	'--color-gray-300',
	'--color-gray-400',
	'--color-gray-600',
	'--color-gray-700',
	'--color-gray-800',
	'--color-gray-900',
	'--color-black',
	'--color-white',
	'--container-2xl',
	'--container-4xl',
	'--text-lg',
	'--text-lg--line-height',
	'--text-xl',
	'--text-xl--line-height',
	'--text-2xl',
	'--text-2xl--line-height',
	'--text-3xl',
	'--text-3xl--line-height',
	'--text-4xl',
	'--text-4xl--line-height',
	'--font-weight-medium',
	'--font-weight-semibold',
	'--font-weight-bold',
	'--radius-lg',
	'--radius-2xl',
	'--radius-3xl',
	'--ease-in-out',
	'--default-transition-duration',
	'--default-transition-timing-function',
	'--default-font-family',
	'--default-mono-font-family',
	'--color-primary',
	'inset-0',
	'bottom-4',
	'left-4',
	'mx-auto',
	'mt-0',
	'mt-12',
	'mb-2',
	'mb-4',
	'mb-8',
	'h-auto',
	'min-h-screen',
	'w-full',
	'max-w-2xl',
	'max-w-4xl',
	'grid-cols-2',
	'flex-col',
	'items-center',
	'gap-2',
	'gap-6',
	'space-y-4',
	'space-y-8',
	'overflow-hidden',
	'rounded-2xl',
	'rounded-3xl',
	'rounded-lg',
	'bg-blue-100',
	'bg-blue-200',
	'bg-blue-300',
	'bg-blue-400',
	'bg-blue-500',
	'bg-blue-600',
	'bg-blue-700',
	'bg-blue-800',
	'bg-blue-900',
	'bg-gray-700',
	'bg-gray-800',
	'bg-green-100',
	'bg-green-200',
	'bg-green-300',
	'bg-green-400',
	'bg-green-500',
	'bg-green-600',
	'bg-green-700',
	'bg-green-800',
	'bg-green-900',
	'bg-primary',
	'bg-red-100',
	'bg-red-500',
	'bg-red-600',
	'bg-red-700',
	'bg-red-800',
	'bg-red-900',
	'bg-gradient-to-b',
	'bg-gradient-to-t',
	'from-black\\/50',
	'from-gray-900',
	'to-gray-800',
	'to-transparent',
	'p-4',
	'px-4',
	'py-8',
	'text-center',
	'text-2xl',
	'text-3xl',
	'text-4xl',
	'text-lg',
	'text-xl',
	'font-bold',
	'font-medium',
	'font-semibold',
	'text-gray-300',
	'text-gray-400',
	'text-red-500',
	'text-white',
	'opacity-0',
	'shadow-2xl',
	'shadow-xl',
	'saturate-0',
	'transition-all',
	'transition-colors',
	'transition-opacity',
	'transition-transform',
	'duration-300',
	'duration-1000',
	'ease-in-out',
	'md\\:grid-cols-3',
	'lg\\:grid-cols-4',
	'lg\\:gap-4',
	'lg\\:p-6',
].sort((a, b) => {
	if (a.length > b.length) {
		return -1;
	} else if (a.length < b.length) {
		return 1;
	}
	return 0;
});

classes.forEach((className) => {
	const hasDashes = className.startsWith('--');
	const uglyValue = uglifier.uglifyValue(className.replace(/^--/g, ''));
	replacer.parse(className, `${hasDashes ? '--' : ''}${uglyValue}`);
});
replacer.replaceFiles();

console.log('mapping', uglifier._mapping);
