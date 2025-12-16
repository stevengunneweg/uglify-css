import { readFileSync } from 'node:fs';
import { ContextOptions } from './context';

export class Extractor {
	private context: ContextOptions;
	private files: string[] = [];
	private classNames: string[] = [];
	private cssVariables: string[] = [];

	constructor(context: ContextOptions, files: string[]) {
		this.context = context;
		this.files = files;
	}

	extract(): {
		classes: string[];
		variables: string[];
	} {
		this.files.forEach((file) => {
			const fileContents = readFileSync(file, 'utf-8');
			let contentsWithoutComments = fileContents.replaceAll(
				/\/(\*)+.*(?=\*\/)\*\/|\/\/.*$/gm,
				'',
			);

			if (file.endsWith('.html')) {
				// Only match inline styles
				contentsWithoutComments = [
					...contentsWithoutComments.matchAll(
						/<style[^>]*>([\s\S]*?)<\/style>/gim,
					),
				].toString();

				if (!fileContents.match(/<!doctype[^>]*html[^>]*>/i)) {
					this.context.canUseUppercase = false;
				}
			}

			// Match only valid CSS class names
			// - Starts after a dot
			// - Followed by at least one escaped characters or non-[whitespace/colon/bracket/curly-bracket/comma/parentheses] characters
			// - At least one hyphen
			// - Followed by at least one escaped characters or non-[whitespace/colon/bracket/curly-bracket/comma/parentheses] characters
			// - End before whitespace, colon, bracket, comma, or parentheses
			const classMatches = contentsWithoutComments.match(
				/(?<=\.)(?:\\.|[^\s:\[\{,).])+-(?:\\.|[^\s:\[\{,).])+(?=[\s:\[\{,).])/gm,
			);
			if (classMatches) {
				this.classNames.push(...classMatches);
			}

			// Match only valid CSS variables
			// - Can not have letters before `--`
			// - Starts with `--`
			// - Followed by at least one letter, number, or hyphen
			// - Ends before a colon
			const variableMatches = contentsWithoutComments.match(
				/(?<![a-zA-Z])--[a-zA-Z0-9-]*(?=\:)/g,
			);
			if (variableMatches) {
				this.cssVariables.push(...variableMatches);
			}
		});
		// Remove duplicates
		const uniqeClassNames = [...new Set(this.classNames)];
		const uniqeVariableNames = [...new Set(this.cssVariables)];

		return {
			classes: uniqeClassNames,
			variables: uniqeVariableNames,
		};
	}
}
