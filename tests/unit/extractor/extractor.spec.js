import { globSync } from 'glob';
import { Extractor } from '../../../src/extractor.js';
import { expect } from '../assert.js';

const mockfiles = globSync(`tests/unit/extractor/**/*.{css,html}`);

const extractor = new Extractor({}, mockfiles);
const result = extractor.extract();

// variables
expect(result.variables.length).toEqual(8);
[
	'--simple',
	'--with-dash',
	'--with-numbers-100',
	'--with-substring-and-more',
	'--with-substring',
	'--with-cityblock--modifier',
	'--modifier',
	'--html-inline-style',
].forEach((className) => {
	expect(result.variables).toContain(className);
});

// classes
expect(result.classes.length).toEqual(21);
[
	'with-hyphen',
	'duplicate-class',
	'with-under_score',
	'withnumbers-12',
	'slash-text\\\/class',
	'slash-number\\\/50',
	'colon-text\\\:class',
	'colon-number\\\:50',
	'with-cityblock--modifier',
	'multiple-selectors-1',
	'multiple-selectors-2',
	'inside-selector',
	'very-oddly\\\:and-complex',
	'group-inside',
	'inside-supports',
	'should-ignore\\\:state',
	'with-brackets-\\\[inline\\\]',
	'\\\[\\\&\\\>\\\*\\\]\\\:with-brackets-before',
	'\\\!with-exclamation',
	'with-exclamation\\\:\\\!and-colon',
	'with-state-modifier',
].forEach((className) => {
	expect(result.classes).toContain(className);
});

console.log('Extractor tests passed.');
