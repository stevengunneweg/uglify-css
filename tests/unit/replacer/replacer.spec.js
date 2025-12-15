import { Replacer } from '../../../src/replacer.js';
import { expect } from '../assert.js';

const replacer = new Replacer({
	path: 'tests/unit/replacer',
});
const mockFiles = {
	'mock.css': '.test { color: "test"; }',
	'variable-value.css': '.test { color: var(--test, "test"); }',
	'class.html': '<a class="test test">test</a>',
	'data.js': 'var test = "test";',
	'variables.js': 'var test = "var(--test)";',
	'test.js': `(condition?"test":"test")`,
};
replacer.files = {
	...mockFiles,
};
replacer.parse('test', 'a');
replacer.parse('--test', '--b');

expect(replacer.files).toEqual({
	'mock.css': '.a { color: "test"; }',
	'variable-value.css': '.a { color: var(--b, "test"); }',
	'class.html': '<a class="a a">test</a>',
	'data.js': 'var test = "a";',
	'variables.js': 'var test = "var(--b)";',
	'test.js': `(condition?"a":"a")`,
});

console.log('Replacer tests passed.');
