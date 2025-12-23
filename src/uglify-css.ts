#!/usr/bin/env node
import { globSync } from 'glob';
import { writeFileSync } from 'node:fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { Algorithm, Context } from './context';
import { Extractor } from './extractor';
import { Logger } from './logger';
import { Replacer } from './replacer';
import { TokenSorter } from './token-sorter';
import { Uglifier } from './uglifier';

const params = yargs(hideBin(process.argv))
	.scriptName('uglify-css')
	.usage('Usage: $0 [options]')
	.option('dry-run', {
		alias: 'd',
		type: 'boolean',
		default: false,
		describe: 'Enable dry run mode',
	})
	.option('verbose', {
		alias: 'v',
		type: 'boolean',
		default: false,
		describe: 'Enable verbose output',
	})
	.option('silent', {
		alias: 's',
		type: 'boolean',
		default: false,
		describe: 'Enable silent mode',
	})
	.option('path', {
		alias: 'p',
		type: 'string',
		default: 'dist',
		describe: 'Path to the directory to process',
	})
	.option('algorithm', {
		alias: 'a',
		type: 'string',
		choices: ['length', 'count', 'countXlength'],
		describe: 'Algorithm to use for sorting tokens',
	})
	.option('skip-classes', {
		type: 'boolean',
		default: false,
		describe: 'Skip uglifying CSS classes',
	})
	.help()
	.alias('help', 'h')
	.parseSync();

const context = new Context({
	dryRun: params.dryRun,
	verbose: params.verbose,
	silent: params.silent,
	path: params.path,
	algorithm: params.algorithm as Algorithm,
	skipClasses: params.skipClasses,
});
const logger = new Logger(context);

const files = globSync(`${context.path}/**/*.{css,html}`);
const allFiles = globSync(`${context.path}/**/*.{css,js,mjs,html}`);
const extractor = new Extractor(context, files);
const { classes, variables } = extractor.extract();
const replacer = new Replacer(context);

let mapping: Record<string, string> = {};
// Give each type (class/variable) its own uglifier to reuse shortest values
// @NOTE: Variables need to be handled first
[variables, ...[context.skipClasses ? [] : classes]].forEach((list) => {
	const uglifier = new Uglifier(context, list);
	const tokensSorted = new TokenSorter(
		context,
		allFiles,
		list,
	).getSortedTokens();

	tokensSorted.forEach((className) => {
		const uglyValue = uglifier.uglifyValue(
			`${className}`.replace(/^--/g, ''),
			className.startsWith('--') ? '--' : '',
		);
		replacer.parse(className, uglyValue);
	});
	mapping = { ...mapping, ...uglifier['_mapping'] };
});
replacer.replaceFiles(context.dryRun);

const mappingSorted = Object.entries(mapping)
	.sort((a, b) => {
		if (a[0] < b[0]) {
			return -1;
		} else if (a[0] > b[0]) {
			return 1;
		}
		return 0;
	})
	.reduce<Record<string, string>>((cummulative, [key, value]) => {
		cummulative[key] = value;
		return cummulative;
	}, {});

if (context.dryRun && context.verbose) {
	logger.log('mapping', mappingSorted);
} else if (!context.dryRun) {
	writeFileSync(
		`${context.path}/uglify-css.map.json`,
		JSON.stringify(mappingSorted, null, '\t'),
		'utf8',
	);
}
if (!context.silent) {
	logger.log('Uglified CSS classes and variables');
	let totalOptimised = 0;
	Object.entries(replacer.fileSizes).forEach(([file, sizes]) => {
		totalOptimised += sizes.old - sizes.new;
		const relativePath = file.split(context.path)[1];
		let color = '';
		if (sizes.old > sizes.new) {
			color = context.colorFgGreen;
		} else if (sizes.old < sizes.new) {
			color = context.colorFgRed;
		}
		logger.log(
			`${context.colorFgBlue}${relativePath}${context.colorReset} - ${sizes.old} -> ${sizes.new} ${color}(${sizes.old === sizes.new ? '' : sizes.old > sizes.new ? '-' : '+'}${Math.abs(sizes.optimised)}%)${context.colorReset}`,
		);
	});
	logger.log(
		`Total optimised: ${context.colorFgGreen}${totalOptimised} B${context.colorReset} using ${context.algorithm}`,
	);
	if (context.dryRun) {
		logger.log(`Changes have not been applied due to the --dry-run flag.`);
	}
}
