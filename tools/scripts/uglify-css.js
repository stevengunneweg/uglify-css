import { globSync } from 'glob';
import { readFileSync } from 'node:fs';

const files = globSync('dist/**/*.css', {});
console.log(files);

files.forEach((file) => {
	const fileContents = readFileSync(file, 'utf-8');
	console.log(fileContents);
});

const mapping = {};
const uglies = [];
function uglifyValue(value) {
	if (mapping[value]) {
		return mapping[value];
	}

	const uglyValue = value.replace(/[-+]/g, '_');
	if (uglies.includes(uglyValue)) {
		return uglyValue + Math.floor(Math.random() * 1000);
	}
	uglies.push(uglyValue);
	mapping[value] = uglyValue;
	return uglyValue;
}

console.log('uglify-css', uglifyValue('bg-red-100'));
console.log('uglify-css', uglifyValue('bg-red-500'));
console.log('uglify-css', uglifyValue('bg-red-500'));
console.log('uglify-css', uglifyValue('bg+red+500'));
