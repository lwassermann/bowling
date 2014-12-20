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
		var testNames = [];
		for (var propertyName in testCase) {
			if (propertyName.indexOf('test') == 0) {
				testNames.push(propertyName); }}
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
	testNaiveScoring: function() {
		var p = new bowling.Player();
		this.assert(p.score() == 0);
		p.frames[0][0] = 5;
		this.assert(p.score() == 5);
	},
	testSpareScoring: function() {
		var p = new bowling.Player();
		this.assert(p.score() == 0);
		p.frames[0][0] = 5;
		p.frames[0][1] = 5;
		this.assert(p.score() == 10);
		p.frames[1][0] = 5;
		// the 5 of frame two counts twice
		this.assert(p.score() == 20);
	},
	testStrikeScoring: function() {
		var p = new bowling.Player();
		this.assert(p.score() == 0);
		p.frames[0][0] = 10;
		this.assert(p.score() == 10);
		p.frames[1][0] = 5;
		this.assert(p.score() == 20);
		p.frames[1][1] = 2;
		this.assert(p.score() == 24);
	}
});


// actually running the tests
if (location.search.indexOf('test=true') !== -1) {
	var resultsVisualization = document.createElement('testResults'),
		// beware premature generalization:
		//     stick with one test case class for the moment
		result = new PlayerTest().run();

	resultsVisualization.innerHTML = result.success + ':' + result.failed;
	resultsVisualization.className = result.failed == 0 ? 'success' : 'failed';
	document.body.appendChild(resultsVisualization);
}

