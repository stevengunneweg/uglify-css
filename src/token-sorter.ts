import { readFileSync } from 'node:fs';
import { ContextOptions } from './context';

export class TokenSorter {
	private context: ContextOptions;
	private files: string[] = [];
	private tokens: string[] = [];

	constructor(context: ContextOptions, files: string[], list: string[]) {
		this.context = context;

		this.files = files;
		this.tokens = list;
	}

	getSortedTokens() {
		const tokensCounted = this.getUsageCount();
		const tokensSorted = this.sort(tokensCounted);
		return tokensSorted;
	}

	private getUsageCount() {
		const fileContentsPerExtension = this.files.reduce<
			Record<string, string>
		>((acc, file) => {
			const fileExtension: string = file.split('.').pop() || '';
			const fileContents = readFileSync(file, 'utf-8');
			if (!acc[fileExtension]) {
				acc[fileExtension] = '';
			}
			acc[fileExtension] += fileContents;
			return acc;
		}, {});
		return this.tokens.reduce<Record<string, Record<string, number>>>(
			(acc, token) => {
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
							fileContents.replace(/\\/gm, '').split(
								new RegExp(
									`${tokenPrefix}${token
										.replace(/(\\)+/gm, '\\') // singlify duplicate escapes
										.replace(
											/[^\\]([\[\]\{\}\(\)])/gm,
											'\\$1',
										)}` // escape non-escaped brackets/braces/parentheses
										.replace(/\\([^\[\]\{\}\(\)])/gm, '$1'), // do not escape other characters
									'gm',
								),
							).length - 1;
					},
				);
				return acc;
			},
			{},
		);
	}

	private sort(tokensCounted: Record<string, Record<string, number>>) {
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
				switch (this.context.algorithm) {
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
			.reduce<string[]>((cummulative, [token]) => {
				cummulative.push(token);
				return cummulative;
			}, []);
	}
}
