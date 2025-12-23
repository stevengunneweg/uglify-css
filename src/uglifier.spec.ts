import { Uglifier } from './uglifier';

describe('Uglifier', () => {
	let uglifier: Uglifier;

	beforeEach(() => {
		uglifier = new Uglifier({} as any);
	});

	describe('constructor', () => {
		it('should initialize', () => {
			expect(uglifier).toBeDefined();
			expect(uglifier['context']).toBeDefined();
			expect(uglifier['_blacklist']).toEqual([]);
			expect(uglifier['_mapping']).toEqual({});
			expect(uglifier['_uglies']).toEqual([]);
			expect(uglifier['_supportedChars']).toEqual([
				...'abcdefghijklmnopqrstuvwxyz',
			]);
			expect(uglifier['_additionalChars']).toEqual([...'0123456789-']);
			expect(uglifier['index']).toEqual(0);
		});

		it('should initialize with context', () => {
			uglifier = new Uglifier(
				{
					canUseUppercase: true,
				} as any,
				['a', 'b'],
			);

			expect(uglifier).toBeDefined();
			expect(uglifier['context']).toBeDefined();
			expect(uglifier['_blacklist']).toEqual(['a', 'b']);
			expect(uglifier['_mapping']).toEqual({});
			expect(uglifier['_uglies']).toEqual(['a', 'b']);
			expect(uglifier['_supportedChars']).toEqual([
				...'abcdefghijklmnopqrstuvwxyz',
				...'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
			]);
			expect(uglifier['_additionalChars']).toEqual([...'0123456789-']);
			expect(uglifier['index']).toEqual(0);
		});
	});

	describe('uglifyValue', () => {
		it('should uglify', () => {
			const result = uglifier.uglifyValue('value1', '--');

			expect(result).toEqual('--a');
		});

		it('should return previously mapped value', () => {
			uglifier['_mapping'] = {
				'--value1': '--g',
			};

			const result = uglifier.uglifyValue('value1', '--');

			expect(result).toEqual('--g');
		});

		it('should return unique value', () => {
			uglifier['_uglies'] = ['--a'];

			const result = uglifier.uglifyValue('value1', '--');

			expect(result).toEqual('--b');
		});

		it('should return multi-char value', () => {
			uglifier['_supportedChars'] = ['a'];
			uglifier['_additionalChars'] = [];
			uglifier['_uglies'] = ['--a', '--aa'];

			const result = uglifier.uglifyValue('value1', '--');

			expect(result).toEqual('--aaa');
		});

		it('should return multi-char value', () => {
			uglifier['_supportedChars'] = ['a', 'b'];
			uglifier['_additionalChars'] = [];
			uglifier['_uglies'] = ['--a', '--b', '--ab', '--aa'];

			const result = uglifier.uglifyValue('value1', '--');

			expect(result).toEqual('--ba');
		});

		it('should adhere to blacklist', () => {
			uglifier['_uglies'] = ['--a'];
			uglifier['_blacklist'] = ['--aa', '--b'];
			uglifier['context'].silent = false;
			const logSpy = vi.spyOn(console, 'log');

			const result = uglifier.uglifyValue('value1', '--');

			expect(result).toEqual('--c');
			expect(logSpy).toHaveBeenCalled();
			logSpy.mockRestore();
		});

		it('should adhere to blacklist', () => {
			uglifier['_uglies'] = ['--a'];
			uglifier['_blacklist'] = ['--aa', '--b'];
			uglifier['context'].silent = true;
			const logSpy = vi.spyOn(console, 'log');

			const result = uglifier.uglifyValue('value1', '--');

			expect(result).toEqual('--c');
			expect(logSpy).not.toHaveBeenCalled();
			logSpy.mockRestore();
		});

		it('should not replace short value', () => {
			uglifier['_supportedChars'] = ['a'];
			uglifier['_additionalChars'] = [];
			uglifier['_uglies'] = ['a', 'aa', 'aaa', 'aaaa'];

			const result = uglifier.uglifyValue('c', '');

			expect(result).toEqual('c');
		});

		it('should replace short value that is already in use', () => {
			uglifier['_supportedChars'] = ['a'];
			uglifier['_additionalChars'] = [];
			uglifier['_uglies'] = ['a', 'aa', 'aaa', 'aaaa'];

			const result = uglifier.uglifyValue('a', '');

			expect(result).toEqual('aaaaa');
		});
	});

	describe('indexToString', () => {
		test.each([
			{ index: 0, result: 'a' },
			{ index: 1, result: 'b' },
			{ index: 2, result: 'c' },
			{ index: 3, result: 'd' },
			{ index: 25, result: 'z' },
			{ index: 26, result: 'aa' },
			{ index: 27, result: 'ab' },
			{ index: 51, result: 'az' },
			{ index: 52, result: 'a0' },
			{ index: 53, result: 'a1' },
			{ index: 61, result: 'a9' },
			{ index: 62, result: 'a-' },
			{ index: 63, result: 'ba' },
		])('should uglify index $index', ({ index, result }) => {
			const output = uglifier['indexToString'](index);

			expect(output).toEqual(result);
		});

		test.each([
			{ index: 0, result: 'a' },
			{ index: 1, result: 'b' },
			{ index: 2, result: 'aa' },
			{ index: 3, result: 'ab' },
			{ index: 4, result: 'ac' },
			{ index: 5, result: 'a0' },
			{ index: 6, result: 'ba' },
			{ index: 7, result: 'bb' },
			{ index: 8, result: 'bc' },
			{ index: 9, result: 'b0' },
			{ index: 10, result: 'aaa' },
			{ index: 11, result: 'aab' },
			{ index: 12, result: 'aac' },
			{ index: 13, result: 'aa0' },
			{ index: 14, result: 'aba' },
			{ index: 15, result: 'abb' },
			{ index: 16, result: 'abc' },
			{ index: 17, result: 'ab0' },
			{ index: 18, result: 'aca' },
			{ index: 19, result: 'acb' },
			{ index: 20, result: 'acc' },
			{ index: 21, result: 'ac0' },
			{ index: 22, result: 'a0a' },
			{ index: 23, result: 'a0b' },
			{ index: 24, result: 'a0c' },
			{ index: 25, result: 'a00' },
			{ index: 26, result: 'baa' },
			{ index: 38, result: 'b0a' },
			{ index: 365, result: 'a0aa0' },
			{ index: 706, result: 'aaabca' },
			{ index: 1337, result: 'acca00' },
		])(
			'should uglify with limited list index $index',
			({ index, result }) => {
				const output = uglifier['indexToString'](
					index,
					['a', 'b'],
					['a', 'b', 'c', '0'],
				);

				expect(output).toEqual(result);
			},
		);
	});
});
