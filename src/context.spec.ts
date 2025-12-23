import { Context, ContextOptions } from './context';

describe('Context', () => {
	let context: Context;

	beforeEach(() => {
		context = new Context({} as any);
	});

	describe('constructor', () => {
		test.each([
			['dryRun', true],
			['verbose', true],
			['silent', true],
			['path', 'mock-path'],
			['algorithm', 'count'],
			['skipClasses', true],
		])('should set %s', (key, value) => {
			const input: ContextOptions = {
				colorReset: '',
				colorFgBlue: '',
				colorFgGreen: '',
				colorFgRed: '',

				dryRun: false,
				verbose: false,
				silent: false,
				path: 'mock-path',
				algorithm: 'count',
				canUseUppercase: false,
				skipClasses: false,
			};
			(input as any)[key] = value;

			context = new Context(input);

			expect(context[key as keyof Context]).toEqual(value);
		});
	});
});
