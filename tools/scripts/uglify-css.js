import { globSync } from 'glob';
import { readFileSync } from 'node:fs';

const files = globSync('dist/**/*.css', {});
console.log(files);

files.forEach((file) => {
	const fileContents = readFileSync(file, 'utf-8');
	console.log(fileContents);
});

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

const uglifier = new Uglifier();
console.log('uglify-css', uglifier.uglifyValue('bg-red-100'));
console.log('uglify-css', uglifier.uglifyValue('bg-red-500'));
console.log('uglify-css', uglifier.uglifyValue('bg-red-500'));
console.log('uglify-css', uglifier.uglifyValue('bg+red+500'));
console.log('uglify-css', uglifier.uglifyValue('bg+red-500'));
console.log('uglify-css', uglifier.uglifyValue('bg-red-500'));
console.log('uglify-css', uglifier.uglifyValue('bg-red-600'));
console.log('uglify-css', uglifier.uglifyValue('bg-red-700'));
console.log('uglify-css', uglifier.uglifyValue('bg-red-800'));
console.log('uglify-css', uglifier.uglifyValue('bg-red-900'));
console.log('uglify-css', uglifier.uglifyValue('bg-red'));
console.log('uglify-css', uglifier.uglifyValue('bg-blue'));
console.log('uglify-css', uglifier.uglifyValue('bg-blue-100'));
console.log('uglify-css', uglifier.uglifyValue('bg-blue-200'));
console.log('uglify-css', uglifier.uglifyValue('bg-blue-300'));
console.log('uglify-css', uglifier.uglifyValue('bg-blue-400'));
console.log('uglify-css', uglifier.uglifyValue('bg-blue-500'));
console.log('uglify-css', uglifier.uglifyValue('bg-blue-600'));
console.log('uglify-css', uglifier.uglifyValue('bg-blue-700'));
console.log('uglify-css', uglifier.uglifyValue('bg-blue-800'));
console.log('uglify-css', uglifier.uglifyValue('bg-blue-900'));
console.log('uglify-css', uglifier.uglifyValue('bg-green'));
console.log('uglify-css', uglifier.uglifyValue('bg-green-100'));
console.log('uglify-css', uglifier.uglifyValue('bg-green-200'));
console.log('uglify-css', uglifier.uglifyValue('bg-green-300'));
console.log('uglify-css', uglifier.uglifyValue('bg-green-400'));
console.log('uglify-css', uglifier.uglifyValue('bg-green-500'));
console.log('uglify-css', uglifier.uglifyValue('bg-green-600'));
console.log('uglify-css', uglifier.uglifyValue('bg-green-700'));
console.log('uglify-css', uglifier.uglifyValue('bg-green-800'));
console.log('uglify-css', uglifier.uglifyValue('bg-green-900'));
console.log('mapping', uglifier._mapping);
