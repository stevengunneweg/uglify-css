#!/usr/bin/env node
import { globSync } from 'glob';
import { readFileSync, writeFileSync } from 'node:fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const colorReset = '\x1b[0m';
const colorFgBlue = '\x1b[34m';
const colorFgGreen = '\x1b[32m';
const colorFgRed = '\x1b[31m';

const params = yargs(hideBin(process.argv))
	.scriptName('uglify-css')
	.usage('Usage: $0 [options]')
	.option('dry-run', {
		alias: 'd',
		type: 'boolean',
		default: false,
		describe: 'Enable dry run mode',
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
	.help()
	.alias('help', 'h').argv;
const dryRun = params.dryRun;
const path = params.path;
const sortingAlgorithm = params.algorithm || 'length';
const canUseUppercase = true;

class Extractor {
	_files = [];
	classNames = [];
	cssVariables = [];

	constructor(files) {
		this._files = files;
	}

	extract() {
		this._files.forEach((file) => {
			const fileContents = readFileSync(file, 'utf-8');
			if (!fileContents.match(/<!doctype[^>]*html[^>]*>/i)) {
				canUseUppercase = false;
			}
			let contentsWithoutComments = fileContents.replaceAll(
				/\/(\*)+.*(?=\*\/)\*\/|\/\/.*$/gm,
				'',
			);

			if (file.endsWith('.html')) {
				// Only match inline styles
				contentsWithoutComments = [
					...contentsWithoutComments.matchAll(
						/<style[^>]*>([\s\S]*?)<\/style>/gim,
					),
				].toString();
			}

			// Match only valid CSS class names
			const classMatches = contentsWithoutComments.match(
				/\.(?:[a-zA-Z0-9-_\\\/]|\\:)*-(?:[a-zA-Z0-9-_\\\/]|\\:)+(?=\s|\:|\{)/gm,
			);
			if (classMatches) {
				// Remove the leading . for each class name
				const cleanMatches = classMatches.map((match) =>
					match.slice(1),
				);
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
		...(canUseUppercase ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : ''), // if <!doctype html>
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
		this.filesPaths = globSync(`${path}/**/*.{css,js,html}`);
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
			const fileExtension = file.split('.').pop();

			// Only replace classes and variables, not values
			let regexPrefix = '';
			if (!value.startsWith('--')) {
				switch (fileExtension) {
					case 'css':
						regexPrefix = '(?<=[.])';
						break;
					case 'html':
						regexPrefix = '(?<=[^:][ ".])';
						break;
					case 'js':
						regexPrefix = '(?<=[^:][ ".])';
						break;
				}
			}

			this.files[file] = contents.replaceAll(
				new RegExp(
					`${regexPrefix}${value}`.replaceAll(
						/[:\\\/]/g,
						'[:\\\\\\\/]*',
					),
					'gm',
				),
				uglyValue,
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

class TokenSorter {
	_files = [];
	_tokens = [];
	_algorithm = 'length';

	constructor(files, list, algorithm) {
		this._files = files;
		this._tokens = list;
		this._algorithm = algorithm;
	}

	getSortedTokens() {
		const tokensCounted = this._getUsageCount();
		const tokensSorted = this._sort(tokensCounted);
		return tokensSorted;
	}

	_getUsageCount() {
		const fileContentsPerExtension = this._files.reduce((acc, file) => {
			const fileExtension = file.split('.').pop();
			const fileContents = readFileSync(file, 'utf-8');
			if (!acc[fileExtension]) {
				acc[fileExtension] = '';
			}
			acc[fileExtension] += fileContents;
			return acc;
		}, {});
		return this._tokens.reduce((acc, token) => {
			Object.entries(fileContentsPerExtension).forEach(
				([fileExtension, fileContents]) => {
					let tokenPrefix = '';
					if (!token.startsWith('--')) {
						switch (fileExtension) {
							case 'css':
								tokenPrefix = '[.]';
								break;
							case 'html':
								tokenPrefix = '[ ".]';
								break;
							case 'js':
								tokenPrefix = '[ "]';
								break;
						}
					}
					if (!acc[token]) {
						acc[token] = {};
					}
					if (!acc[token][fileExtension]) {
						acc[token][fileExtension] = 0;
					}
					acc[token][fileExtension] +=
						fileContents
							.replace(/\\/gm, '')
							.split(
								new RegExp(
									`${tokenPrefix}${token}`.replace(
										/\\/gm,
										'',
									),
									'gm',
								),
							).length - 1;
				},
			);
			return acc;
		}, {});
	}

	_sort(tokensCounted) {
		return Object.entries(tokensCounted)
			.sort(([tokenA, countsA], [tokenB, countsB]) => {
				const countA = Object.values(countsA).reduce(
					(acc, curr) => acc + curr,
					0,
				);
				const countB = Object.values(countsB).reduce(
					(acc, curr) => acc + curr,
					0,
				);
				let weightA = countA;
				let weightB = countB;
				switch (sortingAlgorithm) {
					case 'length':
						weightA = tokenA.length;
						weightB = tokenB.length;
						break;
					case 'count':
						weightA = countA;
						weightB = countB;
						break;
					case 'countXlength':
						weightA =
							(tokenA.replace(/^--/, '').length - 1) * countA;
						weightB =
							(tokenB.replace(/^--/, '').length - 1) * countB;
						break;
					default:
						break;
				}
				if (weightA > weightB) {
					return -1;
				} else if (weightA < weightB) {
					return 1;
				}
				if (tokenA.length > tokenB.length) {
					return -1;
				} else if (tokenA.length < tokenB.length) {
					return 1;
				}
				return 0;
			})
			.reduce((cummulative, [token]) => {
				cummulative.push(token);
				return cummulative;
			}, []);
	}
}

const files = globSync(`${path}/**/*.{css,html}`);
const allFiles = globSync(`${path}/**/*.{css,js,html}`);
const extractor = new Extractor(files);
const { classes, variables } = extractor.extract();
const replacer = new Replacer();

let mapping = {};
// Give each type (class/variable) its own uglifier to reuse shortest values
// @NOTE: Variables need to be handled first
[variables, classes].forEach((list) => {
	const uglifier = new Uglifier(list);
	const tokensSorted = new TokenSorter(
		allFiles,
		list,
		sortingAlgorithm,
	).getSortedTokens();

	tokensSorted.forEach((className) => {
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

if (dryRun) {
	console.log('mapping', mappingSorted);
} else {
	writeFileSync(
		`${path}/uglify-css.map.json`,
		JSON.stringify(mappingSorted, null, '\t'),
		'utf8',
	);
}
console.log('Uglified CSS classes and variables');
let totalOptimised = 0;
Object.entries(replacer.fileSizes).forEach(([file, sizes]) => {
	totalOptimised += sizes.old - sizes.new;
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
console.log(
	`Total optimised: ${colorFgGreen}${totalOptimised} B${colorReset} using ${sortingAlgorithm}`,
);
if (dryRun) {
	console.log(`Changes have not been applied due to the --dry-run flag.`);
}
