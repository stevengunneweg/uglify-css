import { ContextOptions } from './context';

export class Uglifier {
	context: ContextOptions;
	_blacklist: string[] = [];
	_mapping: Record<string, string> = {};
	_uglies: string[] = [];
	_supportedChars: string[] = [...'abcdefghijklmnopqrstuvwxyz'];
	_additionalChars: string[] = [...'0123456789-'];

	constructor(context: ContextOptions, blacklist: string[] = []) {
		this.context = context;

		this._supportedChars = [
			...'abcdefghijklmnopqrstuvwxyz',
			...(this.context.canUseUppercase
				? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
				: ''), // if <!doctype html>
		];
		this._blacklist = blacklist;
		this._uglies = [...this._blacklist];
	}

	uglifyValue(value: string, prefix: string = ''): string {
		const mapKey = `${prefix}${value}`;
		if (this._mapping[mapKey]) {
			return this._mapping[mapKey];
		}

		const defaultCharset = this._supportedChars;
		const extendedCharset = [
			...this._supportedChars,
			...this._additionalChars,
		];

		let index = this._uglies.length;
		let result = '';
		result = defaultCharset[index % defaultCharset.length];
		index = Math.floor(
			(index - defaultCharset.length) / defaultCharset.length,
		);

		while (
			index > 0 ||
			(result.length <= 1 && this._uglies.length >= defaultCharset.length)
		) {
			result += extendedCharset[index % extendedCharset.length];
			index = Math.floor(index / extendedCharset.length);
		}
		let uglyValue = `${prefix}${result}`;

		// Check if value is already present in extracted values
		if (this._blacklist.includes(uglyValue)) {
			if (!this.context.silent) {
				console.log(
					`Value ${uglyValue} is blacklisted, skipping uglification.`,
				);
			}
			return this.uglifyValue(value, prefix);
		}

		// If ugly value does not provide improvement, use the original value
		if (
			uglyValue.length >= mapKey.length &&
			!this._uglies.includes(mapKey)
		) {
			uglyValue = mapKey;
		}

		// Prevent duplicate ugly values
		if (this._uglies.includes(uglyValue)) {
			uglyValue = `${uglyValue}-${Math.floor(Math.random() * 1000)}`;
		}

		this._uglies.push(uglyValue);
		this._mapping[mapKey] = uglyValue;

		return uglyValue;
	}
}
