export function expect(actual) {
	return {
		toEqual: function (expected) {
			if (JSON.stringify(actual) !== JSON.stringify(expected)) {
				console.error(`Expected`, expected, `but got`, actual);
				throw new Error(`Failed`);
			}
		},
		toContain: function (expected) {
			if (!actual.includes(expected)) {
				console.error(actual, `does not include`, expected);
				throw new Error(`Failed`);
			}
		},
	};
}
