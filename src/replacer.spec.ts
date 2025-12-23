import { writeFileSync } from 'node:fs';
import { ContextOptions } from './context';
import { Replacer } from './replacer';

describe('Replacer', () => {
	let replacer: Replacer;

	beforeEach(() => {
		replacer = new Replacer({
			path: './mocks/replacer',
		} as ContextOptions);

		vi.mock('node:fs', async () => {
			const originalFs = await vi.importActual('node:fs');
			return {
				...originalFs,
				writeFileSync: vi.fn(),
			};
		});
	});

	afterAll(() => {
		vi.doUnmock('node:fs');
	});

	describe('parse', () => {
		it('should read files', () => {
			let cssContent = replacer.files['mocks/replacer/mock.css'];
			let jsContent = replacer.files['mocks/replacer/mock.js'];

			expect(cssContent.split('p-1').length - 1).toEqual(1);
			expect(cssContent.split('escaped-class').length - 1).toEqual(1);
			expect(cssContent.split('tailwind-class').length - 1).toEqual(1);
			expect(cssContent.split('text-left').length - 1).toEqual(1);
			expect(cssContent.split('with-state').length - 1).toEqual(1);
			expect(cssContent.split('no-match').length - 1).toEqual(1);
			expect(cssContent).not.toContain('AA');
			expect(cssContent).not.toContain('BB');
			expect(cssContent).not.toContain('CC');
			expect(cssContent).not.toContain('DD');
			expect(cssContent).not.toContain('EE');
			expect(cssContent).not.toContain('X-X');

			expect(jsContent.split('p-1').length - 1).toEqual(9);
			expect(jsContent.split('escaped-class').length - 1).toEqual(11);
			expect(jsContent.split('tailwind-class').length - 1).toEqual(4);
			expect(jsContent.split('text-left').length - 1).toEqual(4);
			expect(jsContent.split('with-state').length - 1).toEqual(4);
			expect(jsContent.split('no-match').length - 1).toEqual(4);
			expect(jsContent).not.toContain('AA');
			expect(jsContent).not.toContain('BB');
			expect(jsContent).not.toContain('CC');
			expect(jsContent).not.toContain('DD');
			expect(jsContent).not.toContain('EE');
			expect(jsContent).not.toContain('X-X');
		});

		it('should parse', () => {
			let cssContent = replacer.files['mocks/replacer/mock.css'];
			let jsContent = replacer.files['mocks/replacer/mock.js'];

			Object.entries({
				'p-1': 'AA',
				'escaped-class\\:m-1': 'BB',
				'tailwind-class-\\[#value\\]': 'CC',
				'\\[\\&\\>\\*\\]\\:text-left': 'DD',
				'with-state': 'EE',
				'no-match': 'X-X',
			}).forEach(([key, value]) => {
				replacer.parse(key, value);
			});

			cssContent = replacer.files['mocks/replacer/mock.css'];
			jsContent = replacer.files['mocks/replacer/mock.js'];

			// Verify CSS
			expect(cssContent.split('p-1').length - 1).toEqual(0);
			expect(cssContent.split('escaped-class').length - 1).toEqual(0);
			expect(cssContent.split('tailwind-class').length - 1).toEqual(0);
			expect(cssContent.split('text-left').length - 1).toEqual(0);
			expect(cssContent.split('with-state').length - 1).toEqual(0);
			expect(cssContent.split('no-match').length - 1).toEqual(0);
			expect(cssContent.split('AA').length - 1).toEqual(1);
			expect(cssContent.split('BB').length - 1).toEqual(1);
			expect(cssContent.split('CC').length - 1).toEqual(1);
			expect(cssContent.split('DD').length - 1).toEqual(1);
			expect(cssContent.split('EE').length - 1).toEqual(1);
			expect(cssContent.split('X-X').length - 1).toEqual(1);
			// Verify JS
			expect(jsContent.split('p-1').length - 1).toEqual(1);
			expect(jsContent.split('escaped-class').length - 1).toEqual(1);
			expect(jsContent.split('tailwind-class').length - 1).toEqual(0);
			expect(jsContent.split('text-left').length - 1).toEqual(0);
			expect(jsContent.split('with-state').length - 1).toEqual(0);
			expect(jsContent.split('no-match').length - 1).toEqual(4);
			expect(jsContent.split('AA').length - 1).toEqual(8);
			expect(jsContent.split('BB').length - 1).toEqual(10);
			expect(jsContent.split('CC').length - 1).toEqual(4);
			expect(jsContent.split('DD').length - 1).toEqual(4);
			expect(jsContent.split('EE').length - 1).toEqual(4);
			expect(jsContent.split('X-X').length - 1).toEqual(0);
			expect(jsContent).toContain(
				'occurrence AA and also inside a string "AA AA and AA"',
			);
			expect(jsContent).toContain(
				'A class with multiple escaped selector .BB[data-test^="test"] should mark the selector',
			);
		});

		test.each([
			{
				name: 'css class',
				filetype: 'css',
				input: '.test-key { color: "test-key"; }',
				expected: '.a { color: "test-key"; }',
			},
			{
				name: 'css variable',
				filetype: 'css',
				input: '.test-key { color: var(--test-key, "test-key"); }',
				expected: '.a { color: var(--b, "test-key"); }',
			},
			{
				name: 'html class',
				filetype: 'html',
				input: '<a class="test-key test-key">test-key</a>',
				expected: '<a class="a a">test-key</a>',
			},
			{
				name: 'js class string',
				filetype: 'js',
				input: 'let testKey = "test-key";',
				expected: 'let testKey = "a";',
			},
			{
				name: 'js variable string',
				filetype: 'js',
				input: 'let testKey = "var(--test-key)";',
				expected: 'let testKey = "var(--b)";',
			},
			{
				name: 'js conditional',
				filetype: 'js',
				input: `(condition?"test-key":"test-key")`,
				expected: `(condition?"a":"a")`,
			},
		] as {
			name: string;
			filetype: string;
			input: string;
			expected: string;
		}[])('should parse $name', ({ filetype, input, expected }) => {
			replacer.files = { [`filename.${filetype}`]: input };

			Object.entries({
				'--test-key': '--b',
				'test-key': 'a',
			}).forEach(([key, value]) => {
				replacer.parse(key, value);
			});

			expect(replacer.files[`filename.${filetype}`]).toEqual(expected);
		});
	});

	describe('replaceFiles', () => {
		it('should calculate optimised sizes', () => {
			replacer.fileSizes['mocks/replacer/mock.css'].old = 500;
			replacer.fileSizes['mocks/replacer/mock.js'].old = 500;

			replacer['replaceFiles'](true);

			expect(replacer.fileSizes).toEqual({
				'mocks/replacer/mock.css': {
					new: 240,
					old: 500,
					optimised: 52,
				},
				'mocks/replacer/mock.js': {
					new: 1980,
					old: 500,
					optimised: -296,
				},
			});
		});

		it('should calculate optimised sizes', () => {
			replacer.fileSizes['mocks/replacer/mock.css'].old = 500;
			replacer.fileSizes['mocks/replacer/mock.js'].old = 500;

			replacer['replaceFiles'](false);

			expect(replacer.fileSizes).toEqual({
				'mocks/replacer/mock.css': {
					new: 240,
					old: 500,
					optimised: 52,
				},
				'mocks/replacer/mock.js': {
					new: 1980,
					old: 500,
					optimised: -296,
				},
			});
			expect(writeFileSync).toHaveBeenCalledTimes(2);
		});
	});
});
