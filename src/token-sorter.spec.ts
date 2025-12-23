import { globSync } from 'node:fs';
import { ContextOptions } from './context';
import { TokenSorter } from './token-sorter';

describe('TokenSorter', () => {
	let mockContext: ContextOptions = {
		algorithm: 'length',
	} as ContextOptions;
	let tokenSorter: TokenSorter;
	const mockfiles = globSync(`mocks/token-sorter/**/*.{css,js,mjs,html}`);
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
		'.bg-\\\\[linear-gradient\\\\(180deg\\\\,rgba\\\\(0\\\\,109\\\\,104\\\\,0\\\\.15\\\\)_0\\\\%\\\\,rgba\\\\(255\\\\,255\\\\,255\\\\,0\\\\.15\\\\)_100\\\\%\\\\)\\\\]{background-image:linear-gradient(180deg,#006d6826,#ffffff26)}',
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

	describe('getUsageCount', () => {
		it('should count token usage', () => {
			const expected = {
				'.bg-\\\\[linear-gradient\\\\(180deg\\\\,rgba\\\\(0\\\\,109\\\\,104\\\\,0\\\\.15\\\\)_0\\\\%\\\\,rgba\\\\(255\\\\,255\\\\,255\\\\,0\\\\.15\\\\)_100\\\\%\\\\)\\\\]{background-image:linear-gradient(180deg,#006d6826,#ffffff26)}':
					{
						css: 0,
						html: 0,
						js: 1,
					},
				'\\!with-exclamation': {
					css: 1,
					html: 0,
					js: 0,
				},
				'\\[\\&\\>\\*\\]\\:with-brackets-before': {
					css: 1,
					html: 0,
					js: 0,
				},
				'colon-number\\:50': {
					css: 1,
					html: 0,
					js: 0,
				},
				'colon-text\\:class': {
					css: 1,
					html: 0,
					js: 0,
				},
				'duplicate-class': {
					css: 1,
					html: 0,
					js: 0,
				},
				'group-inside': {
					css: 1,
					html: 0,
					js: 0,
				},
				'inside-selector': {
					css: 1,
					html: 0,
					js: 0,
				},
				'inside-supports': {
					css: 1,
					html: 0,
					js: 0,
				},
				'multiple-selectors-1': {
					css: 1,
					html: 0,
					js: 0,
				},
				'multiple-selectors-2': {
					css: 1,
					html: 0,
					js: 0,
				},
				'should-ignore\\:state': {
					css: 1,
					html: 0,
					js: 0,
				},
				'slash-number\\/50': {
					css: 1,
					html: 0,
					js: 0,
				},
				'slash-text\\/class': {
					css: 1,
					html: 0,
					js: 0,
				},
				'very-oddly\\:and-complex': {
					css: 1,
					html: 0,
					js: 0,
				},
				'with-attr-selector': {
					css: 1,
					html: 0,
					js: 1,
				},
				'with-brackets-\\[inline\\]': {
					css: 1,
					html: 0,
					js: 0,
				},
				'with-cityblock--modifier': {
					css: 1,
					html: 0,
					js: 0,
				},
				'with-exclamation\\:\\!and-colon': {
					css: 1,
					html: 0,
					js: 0,
				},
				'with-hyphen': {
					css: 2,
					html: 0,
					js: 2,
				},
				'with-state-modifier': {
					css: 1,
					html: 0,
					js: 0,
				},
				'with-tailwind-custom-class-\\[minmax\\(min-content\\,1fr\\)_repeat\\(1\\,minmax\\(0\\,1fr\\)\\)\\]':
					{
						css: 1,
						html: 0,
						js: 0,
					},
				'with-under_score': {
					css: 1,
					html: 0,
					js: 0,
				},
				'withnumbers-12': {
					css: 1,
					html: 0,
					js: 0,
				},
			};

			const result = tokenSorter['getUsageCount']();

			expect(result).toEqual(expected);
		});
	});

	describe('sort', () => {
		it('should sort by length', () => {
			mockContext.algorithm = 'length';
			const input = {
				'short-token': { css: 2, html: 1 },
				'longer-than-others-token': { css: 1, html: 0 },
				'extremely-long-but-only-used-once-but-lots-of-improvement-token':
					{ css: 1, html: 0 },
				'a-token': { css: 19, html: 0 },
				'medium-token': { css: 3, html: 2 },
			};
			const expected = [
				'extremely-long-but-only-used-once-but-lots-of-improvement-token',
				'longer-than-others-token',
				'medium-token',
				'short-token',
				'a-token',
			];

			const result = tokenSorter['sort'](input);

			expect(result).toEqual(expected);
		});

		it('should sort by count', () => {
			mockContext.algorithm = 'count';
			const input = {
				'short-token': { css: 2, html: 1 },
				'longer-than-others-token': { css: 1, html: 0 },
				'extremely-long-but-only-used-once-but-lots-of-improvement-token':
					{ css: 1, html: 0 },
				'a-token': { css: 19, html: 0 },
				'medium-token': { css: 3, html: 2 },
			};
			const expected = [
				'a-token',
				'medium-token',
				'short-token',
				'extremely-long-but-only-used-once-but-lots-of-improvement-token',
				'longer-than-others-token',
			];

			const result = tokenSorter['sort'](input);

			expect(result).toEqual(expected);
		});

		it('should sort by countXlength', () => {
			mockContext.algorithm = 'countXlength';
			const input = {
				'short-token': { css: 2, html: 1 },
				'longer-than-others-token': { css: 1, html: 0 },
				'extremely-long-but-only-used-once-but-lots-of-improvement-token':
					{ css: 1, html: 0 },
				'a-token': { css: 19, html: 0 },
				'medium-token': { css: 3, html: 2 },
			};
			const expected = [
				'a-token',
				'extremely-long-but-only-used-once-but-lots-of-improvement-token',
				'medium-token',
				'short-token',
				'longer-than-others-token',
			];

			const result = tokenSorter['sort'](input);

			expect(result).toEqual(expected);
		});

		it('should sort by length as default', () => {
			mockContext.algorithm = 'unknown-algorithm' as any;
			const input = {
				'short-token': { css: 2, html: 1 },
				'longer-than-others-token': { css: 1, html: 0 },
				'extremely-long-but-only-used-once-but-lots-of-improvement-token':
					{ css: 1, html: 0 },
				'a-token': { css: 19, html: 0 },
				'medium-token': { css: 3, html: 2 },
			};
			const expected = [
				'extremely-long-but-only-used-once-but-lots-of-improvement-token',
				'longer-than-others-token',
				'medium-token',
				'short-token',
				'a-token',
			];

			const result = tokenSorter['sort'](input);

			expect(result).toEqual(expected);
		});

		it('should have secondary sorting based on token length', () => {
			mockContext.algorithm = 'count';
			const input = {
				b: { css: 1, html: 3 },
				aa: { css: 2, html: 2 },
				a: { css: 3, html: 1 },
				c: { css: 2, html: 2 },
				bb: { css: 2, html: 2 },
			};
			const expected = ['aa', 'bb', 'b', 'a', 'c'];

			const result = tokenSorter['sort'](input);

			expect(result).toEqual(expected);
		});
	});
});
