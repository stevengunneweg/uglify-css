import { globSync } from 'glob';
import { Extractor } from './extractor';

describe('Extractor', () => {
	const mockfiles = globSync(`mocks/extractor/**/*.{css,html}`);
	let extractor: Extractor;
	let result: any;

	beforeEach(() => {
		extractor = new Extractor({} as any, mockfiles);
	});

	describe('should extract correct variables', () => {
		it('should extract correct variables', () => {
			result = extractor.extract();

			expect(result.variables.length).toEqual(8);
			[
				'--simple',
				'--with-dash',
				'--with-numbers-100',
				'--with-substring-and-more',
				'--with-substring',
				'--with-cityblock--modifier',
				'--modifier',
				'--html-inline-style',
			].forEach((className) => {
				expect(result.variables).toContain(className);
			});
		});

		it('should extract correct classes', () => {
			result = extractor.extract();

			expect(result.classes.length).toEqual(22);
			[
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
			].forEach((className) => {
				expect(result.classes).toContain(className);
			});
		});
	});
});
