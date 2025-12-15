export class Uglifier {
	context;
	_blacklist = [];
	_mapping = {};
	_uglies = [];
	_supportedChars = [...'abcdefghijklmnopqrstuvwxyz'];
	_additionalChars = [...'0123456789-'];

	constructor(context, blacklist = []) {
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

	uglifyValue(value, prefix = '') {
		const mapKey = `${prefix}${value}`;
		if (this._mapping[mapKey]) {
			return this._mapping[mapKey];
		}

		const defaultCharset = this._supportedChars;
		const extendedCharset = [
			...this._supportedChars,
			...this._additionalChars,
		];

		let n = this._uglies.length;
		let result = '';
		result = defaultCharset[n % defaultCharset.length];
		n = Math.floor((n - defaultCharset.length) / defaultCharset.length);

		while (
			n > 0 ||
			(result.length <= 1 && this._uglies.length >= defaultCharset.length)
		) {
			result += extendedCharset[n % extendedCharset.length];
			n = Math.floor(n / extendedCharset.length);
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
