import { readFileSync, writeFileSync } from 'node:fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import zlib from 'zlib';

const params = yargs(hideBin(process.argv))
	.scriptName('uglify-css')
	.usage('Usage: $0 [options]')
	.option('directory', {
		alias: 'd',
		type: 'string',
		describe: 'Path to the directory to process',
	})
	.option('file', {
		alias: 'f',
		type: 'string',
		describe: 'Path to the directory to process',
	})
	.option('name', {
		alias: 'n',
		type: 'string',
		describe: 'Name suffix for the output file',
	})
	.help()
	.alias('help', 'h').argv;

const directory = params.directory || 'dist/angular/browser';
const input = readFileSync(`${directory}/${params.file || 'index.html'}`);
const compressed = zlib.brotliCompressSync(input);
writeFileSync(`${directory}/index.html-${params.name}.br`, compressed);
