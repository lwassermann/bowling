Test = function (){
}

Object.extend(Test.prototype, {
	assert: function(value, message) {
		if (!!value) { return; }
		throw new Error(message);
	},
	deny: function(value, message) {
		return this.assert(!value, message);
	},
	run: function() {
		var result = {success: 0, failed: 0, errors:[]},
			testCase = this;
		// ToDo: look up property collection along the prototype chain
		var testNames = Object.keys(this.__proto__).filter(function(ea) {
			return ea.indexOf('test') == 0;
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
		return result;
	}
})

PlayerTest = function() {};

PlayerTest.prototype = new Test();
Object.extend(PlayerTest.prototype, {
	testScoring: function() {
		var p = new bowling.Player();
		this.assert(p.score() == 0);
		p.frames[0][1] = 5;
		this.assert(p.score() == 5);
	}
});


// actually running the tests
if (document.documentURI.indexOf('test=true') !== -1) {
	var resultsVisualization = document.createElement('testResults'),
		// beware premature generalization:
		//     stick with one test case class for the moment
		result = new PlayerTest().run();

	resultsVisualization.innerHTML = result.success + ':' + result.failed;
	document.body.appendChild(resultsVisualization);
}

