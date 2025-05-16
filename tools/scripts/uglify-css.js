import { globSync } from 'glob';
import { readFileSync } from 'node:fs';

const files = globSync('dist/**/*.css', {});
console.log(files);

files.forEach((file) => {
	const fileContents = readFileSync(file, 'utf-8');
	console.log(fileContents);
});
