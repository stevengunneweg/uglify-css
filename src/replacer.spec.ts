import { ContextOptions } from './context';
import { Replacer } from './replacer';

describe('Replacer', () => {
	let replacer: Replacer;

	beforeEach(() => {
		replacer = new Replacer({
			path: './src',
		} as ContextOptions);
	});

	describe('parse', () => {
		test.each([
			{
				name: 'css class',
				input: {
					'mock.css': '.test { color: "test"; }',
				},
				expected: { 'mock.css': '.a { color: "test"; }' },
			},
			{
				name: 'css variable',
				input: {
					'variable-value.css':
						'.test { color: var(--test, "test"); }',
				},
				expected: {
					'variable-value.css': '.a { color: var(--b, "test"); }',
				},
			},
			{
				name: 'html class',
				input: { 'class.html': '<a class="test test">test</a>' },
				expected: { 'class.html': '<a class="a a">test</a>' },
			},
			{
				name: 'js class string',
				input: { 'data.js': 'var test = "test";' },
				expected: { 'data.js': 'var test = "a";' },
			},
			{
				name: 'js variable string',
				input: { 'variables.js': 'var test = "var(--test)";' },
				expected: { 'variables.js': 'var test = "var(--b)";' },
			},
			{
				name: 'js conditional',
				input: { 'test.js': `(condition?"test":"test")` },
				expected: { 'test.js': `(condition?"a":"a")` },
			},
		] as {
			name: string;
			input: Record<string, string>;
			expected: Record<string, string>;
		}[])('should parse $name', ({ input, expected }) => {
			replacer.files = input;
			replacer.parse('--test', '--b');
			replacer.parse('test', 'a');

			expect(replacer.files).toEqual(expected);
		});
	});
});
