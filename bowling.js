var scores = [];
bowling = {};

bowling.Player = function (optName) {
    this.name = optName || 'player';
    this.frames = Array.range(10).map(function() { return [0, 0]; });
    return this;
};

Object.extend(bowling.Player.prototype, {
    score: function() {
        var frameScore = this.frameScore;
        return this.frames.reduce(function(sum, ea, idx, ary) {
            return sum + frameScore(ea);
        }, 0)
    },
    frameScore: function(frame, nextRolls) {
        return frame.reduce(function(sum, ea) { return ea + sum }, 0);
    }
});