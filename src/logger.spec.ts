import { Logger } from './logger';

describe('Logger', () => {
	let logger: Logger;

	beforeEach(() => {
		logger = new Logger({} as any);
	});

	describe('log', () => {
		it('should log to console', () => {
			const logSpy = vi
				.spyOn(console, 'log')
				.mockImplementation(() => {});
			logger['context'].silent = false;

			logger.log('value1', 'value2');

			expect(logSpy).toHaveBeenCalledWith('value1', 'value2');
			logSpy.mockRestore();
		});

		it('should not log to console when silent', () => {
			const logSpy = vi
				.spyOn(console, 'log')
				.mockImplementation(() => {});
			logger['context'].silent = true;

			logger.log('value1', 'value2');

			expect(logSpy).not.toHaveBeenCalled();
			logSpy.mockRestore();
		});
	});
});
