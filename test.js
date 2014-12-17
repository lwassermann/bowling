eTest = function (){
}

Object.extend(Test, {
	assert: function(value, message) {
		if (!!value) { return; }
		throw new Error(message);
	},
	deny: function(value, message) {
		return this.assert(!value, message);
	};
})

Object.extend(Test, {
	run: function() {
		var result = {success: 0, failed: 0, errors:[]},
			testCase = new this();
		// ToDo: look up property collection along the prototype chain
		var testNames = Object.keys(this).filter(function(ea) {
			return ea.startsWith('test');
		});
		testNames.forEach(function(ea) {
			try {
				testCase.setup && testCase.setup()
				testCase[ea]();
				result.success = result.success + 1;
			}
			catch (e) {
				result.errors.push(ea + ': ' + e.message);
				result.failed = result.failed + 1;
			}
			finally {
				testCase.tearDown && testCase.tearDown();
			}
		})
	}
})

