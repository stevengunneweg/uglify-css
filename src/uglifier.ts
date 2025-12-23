import { ContextOptions } from './context';

export class Uglifier {
	private context: ContextOptions;
	private _blacklist: string[] = [];
	private _mapping: Record<string, string> = {};
	private _uglies: string[] = [];
	private _supportedChars: string[] = [...'abcdefghijklmnopqrstuvwxyz'];
	private _additionalChars: string[] = [...'0123456789-'];
	private index = 0;

	constructor(context: ContextOptions, blacklist: string[] = []) {
		this.context = context;

		this._supportedChars = [
			...'abcdefghijklmnopqrstuvwxyz',
			...(this.context.canUseUppercase
				? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
				: ''), // if <!doctype html> is missing
		];
		this._blacklist = blacklist;
		this._uglies = [...this._blacklist];
	}

	uglifyValue(value: string, prefix: string = ''): string {
		const mapKey = `${prefix}${value}`;
		if (this._mapping[mapKey]) {
			return this._mapping[mapKey];
		}

		const result = this.indexToString(this.index);
		let uglyValue = `${prefix}${result}`;
		this.index++;

		// Check if generated value is already in use
		if (this._uglies.includes(uglyValue)) {
			return this.uglifyValue(value, prefix);
		}
		// Check if value is blacklisted
		if (this._blacklist.includes(uglyValue)) {
			if (!this.context.silent) {
				console.log(
					`Value ${uglyValue} is blacklisted, skipping uglification.`,
				);
			}
			return this.uglifyValue(value, prefix);
		}
		// Check if change provides improvement
		if (
			uglyValue.length >= mapKey.length &&
			!this._uglies.includes(mapKey)
		) {
			uglyValue = mapKey;
		}

		this._uglies.push(uglyValue);
		this._mapping[mapKey] = uglyValue;

		return uglyValue;
	}

	private indexToString(
		index: number,
		defaultCharSet: string[] = this._supportedChars,
		extendedCharSet: string[] = [
			...this._supportedChars,
			...this._additionalChars,
		],
	): string {
		const base = extendedCharSet.length;
		const firstBase = defaultCharSet.length;

		let length = 1;
		let count = firstBase;

		// Determine how many characters the result needs
		while (index >= count) {
			index -= count;
			length++;
			count = firstBase * Math.pow(base, length - 1);
		}

		let result = '';

		// First character (restricted subset)
		const firstIndex = Math.floor(index / Math.pow(base, length - 1));
		result += defaultCharSet[firstIndex];

		// Remaining characters (full list)
		let remainder = index % Math.pow(base, length - 1);

		for (let pos = length - 2; pos >= 0; pos--) {
			const idx = Math.floor(remainder / Math.pow(base, pos));
			result += extendedCharSet[idx];
			remainder %= Math.pow(base, pos);
		}

		return result;
	}
}
