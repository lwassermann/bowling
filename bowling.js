var scores = [];
bowling = {};

bowling.Player = function (optName) {
    this.name = optName || 'player';
    this.frames = Array.range(10).map(function() { return [0, 0]; });
    this.bonusRolls = [0, 0];
    return this;
};

Object.extend(bowling.Player.prototype, {
    score: function() {
        return this.frames.reduceRight(function(acc, frame) {
            var sum = acc.sum,
                nextRolls = acc.nextRolls,
                frameResult = frame[0] + frame[1];
            if (frame[0] == 10) { // strike
                return {
                    sum: sum + 10 + nextRolls.reduce(Functions.plus),
                    nextRolls: [10, nextRolls[0]]};
            } else if (frameResult == 10) { //spare
                return {
                    sum: sum + 10 + nextRolls[0],
                    nextRolls: frame};
            } else {
                return {
                    sum: sum + frameResult,
                    nextRolls: frame};
            }
        }, { sum: 0, nextRolls: this.bonusRolls}).sum
    },
});