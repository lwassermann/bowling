var bowling = {};
bowling.players = [];

bowling.Player = function (optName) {
    this.name = optName || 'Player';
    this.frames = Array.range(10).map(function() { return [0, 0]; });
    this.bonusRolls = [0, 0];
    this.currentRoll = [0, 0]; // frame[0-10], roll[0-1]

    // In this implementation, every player has her own row. In the interest
    // of distributing concerns, an implementation with more future should
    // associate business logic, i.e. players with visualizations, i.e. HTML
    // nodes in another way.
    this.renderContext = bowling.createRow();
    this.color = randomColor();
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
    render: function() {
        var content = [this.name]
            .concat(this.frames)
            .concat([this.bonusRolls, this.score()]);
        content.forEach(function(ea, idx) {
            this.renderContext.children[idx].innerHTML = content[idx];
        }, this);
    }
});

bowling.addPlayer = function(optName) {
    var newPlayer = new bowling.Player(optName);
    scores.appendChild(newPlayer.renderContext);
    bowling.players.push(newPlayer);
    updateVisualization()
    return newPlayer;
};

/*
   Visualization updates are implemented explicitly. There are more
   elegant solutions, e.g. obeserver pattern, ticking, or data bindings. But
   since the sources of change are well understood in this small example,
   explicit update calls should suffice
*/

updateVisualization = function() {
    // If players could be removed or their sequence changed, we'd have to
    // ensure that their HTML nodes are removed/reordered.
    bowling.players.invoke('render');

};
// setInterval(updateVisualization, 100);

bowling.createRow = function(optContent) {
    var tr = document.createElement('tr');
    Array.range(13).forEach(function(ea) {
        var td = document.createElement('td');
        td.appendChild(document.createTextNode(optContent && optContent[ea] || ''));
        tr.appendChild(td);
    })
    return tr;
};
