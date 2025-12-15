import { readFileSync } from 'node:fs';

export class TokenSorter {
	context;
	_files = [];
	_tokens = [];
	_algorithm = 'length';

	constructor(context, files, list, algorithm) {
		this.context = context;

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
			.reduce((cummulative, [token]) => {
				cummulative.push(token);
				return cummulative;
			}, []);
	}
}
