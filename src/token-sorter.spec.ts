import { globSync } from 'node:fs';
import { ContextOptions } from './context';
import { TokenSorter } from './token-sorter';

describe('TokenSorter', () => {
	let mockContext: ContextOptions = {
		algorithm: 'length',
	} as ContextOptions;
	let tokenSorter: TokenSorter;
	const mockfiles = globSync(`mocks/extractor/**/*.{css,html}`);
	const mockTokens = [
		'with-hyphen',
		'duplicate-class',
		'with-under_score',
		'withnumbers-12',
		'slash-text\\\/class',
		'slash-number\\\/50',
		'colon-text\\\:class',
		'colon-number\\\:50',
		'with-cityblock--modifier',
		'multiple-selectors-1',
		'multiple-selectors-2',
		'inside-selector',
		'very-oddly\\\:and-complex',
		'group-inside',
		'inside-supports',
		'should-ignore\\\:state',
		'with-brackets-\\\[inline\\\]',
		'\\\[\\\&\\\>\\\*\\\]\\\:with-brackets-before',
		'\\\!with-exclamation',
		'with-exclamation\\\:\\\!and-colon',
		'with-state-modifier',
		'with-attr-selector',
		'with-tailwind-custom-class-\\\[minmax\\\(min-content\\\,1fr\\\)_repeat\\\(1\\\,minmax\\\(0\\\,1fr\\\)\\\)\\\]',
	];

	beforeEach(() => {
		tokenSorter = new TokenSorter(mockContext, mockfiles, [...mockTokens]);
	});

	describe('getSortedTokens', () => {
		it('should return tokens sorted by length', () => {
			mockContext.algorithm = 'length';
			const expected = [...mockTokens].sort(
				(a, b) => b.length - a.length,
			);

			const result = tokenSorter.getSortedTokens();

			expect(result).toEqual(expected);
		});
	});
});
