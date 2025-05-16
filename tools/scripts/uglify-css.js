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

	uglifyValue(value) {
		if (this._mapping[value]) {
			return this._mapping[value];
		}

		const uglyValue = value.replace(/[-+]/g, '_');
		if (this._uglies.includes(uglyValue)) {
			return uglyValue + Math.floor(Math.random() * 1000);
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
