export function getTokenRegex(token: string, fileExtension: string) {
	// Only replace classes and variables, not values
	let regexPrefix = '';
	let regexSuffix = '(?![^\\s\'"`.,:;\\\\{\\}\\(\\)\\[\\]])';
	if (!token.startsWith('--')) {
		switch (fileExtension) {
			case 'css':
				regexPrefix = '(?<=\\.)';
				break;
			case 'html':
				regexPrefix = '(?<![^\\s"\'`.,])(?<=[^:]|[\\s"\'`.])';
				break;
			case 'js':
				regexPrefix =
					'(?<![^\\s"\'`.,])(?<!var\\(--[-a-zA-Z0-9]*,[\\s]?)(?<=[^:]|[\\s"\'`.])';
				break;
		}
	}
	const regexToken = token
		.replace(/([\\^$.*+?\(\)\[\]\{\}|])/g, '\\\\*\\$1') // regex escape special characters
		// .replace(/\\([^\[\]\{\}\(\)])/gm, '$1') // do not escape other characters
		// .replace(/[^\\]([\[\]\{\}\(\)])/gm, '\\$1') // escape non-escaped brackets/braces/parentheses
		// .replace(/(\\)+/gm, '\\\\*\\') // singlify duplicate escapes;
		.replace(/!!/gm, '!!');

	return new RegExp(`${regexPrefix}${regexToken}${regexSuffix}`, 'gm');
}
