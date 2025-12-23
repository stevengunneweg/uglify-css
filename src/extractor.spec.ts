import { globSync } from 'glob';
import { Extractor } from './extractor';

describe('Extractor', () => {
	const mockfiles = globSync(`mocks/extractor/**/*.{css,html}`);
	let extractor: Extractor;
	let result: any;

	beforeEach(() => {
		extractor = new Extractor(
			{
				canUseUppercase: true,
			} as any,
			mockfiles,
		);

		(global as any).shouldUseExtractorFsMock = false;

		vi.mock('node:fs', async () => {
			const originalFs = await vi.importActual('node:fs');
			return {
				...originalFs,
				readFileSync: (path: string) => {
					if (
						(global as any).shouldUseExtractorFsMock &&
						path.endsWith('mock.html')
					) {
						return `<html></html>`;
					}
					return (originalFs as any).readFileSync(path, 'utf-8');
				},
			};
		});
	});

	afterAll(() => {
		(global as any).shouldUseExtractorFsMock = undefined;
		vi.doUnmock('node:fs');
	});

	describe('extract', () => {
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
				expect(extractor['context'].canUseUppercase).toBe(true);
			});
		});

		it('should extract correct classes', () => {
			result = extractor.extract();

			expect(result.classes.length).toEqual(23);
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
				'with-tailwind-custom-class-\\\[minmax\\\(min-content\\\,1fr\\\)_repeat\\\(1\\\,minmax\\\(0\\\,1fr\\\)\\\)\\\]',
			].forEach((className) => {
				expect(result.classes).toContain(className);
				expect(extractor['context'].canUseUppercase).toBe(true);
			});
		});

		it('should check missing doctype', () => {
			(global as any).shouldUseExtractorFsMock = true;

			extractor.extract();

			expect(extractor['context'].canUseUppercase).toBe(false);
		});
	});
});
