var bowling = {};
bowling.players = [];

bowling.Player = function (optName) {
    this.name = optName || 'Player';
    this.frames = Array.range(10).map(function() { return [0, 0]; });
    this.bonusRolls = [0, 0];
    this.currentRoll = [0, 0]; // frame[0-10], roll[0-1]

    // In this implementation, every player has her own row. In the interest
    // of distributing concerns, an implementation with more future should
    // associate business logic, i.e. players & rolls, with visualizations, i.e. HTML
    // nodes, in another way.
    this.renderContext = bowling.createRow();
    this.color = Color.random();
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

    randomRoll: function() {
        var frameNr = this.currentRoll[0], roll = this.currentRoll[1];
        if (frameNr < 0) {
            throw new Error(this.name + ' can not roll again.') };
        var availablePins = roll == 0 ? 10 : (10 - this.frames[frameNr][0]);
        this.frames[frameNr][roll] = Math.floor(Math.random() * (availablePins + 1));

        // now, advance the currentRoll pointer
        if (roll == 0 && this.frames[frameNr].reduce(Functions.plus) != 10) {
            // advance rolls
            this.currentRoll[1] = 1;
            // if we are in bonus rolls and the last frame was not a strike
            if (frameNr == 10 && this.frames[9][1] != 0) {
                this.currentRoll = [-1, 0];
            }
        } else {
            // advance frames
            this.currentRoll = [frameNr + 1, 0];
            // if we are in bonus rolls and the last frame is neither strike nor spare
            if (frameNr == 9 && this.frames[9].reduce(Functions.plus) < 10) {
                this.currentRoll = [-1, 0];
            }
            if (frameNr == 10) {
                this.currentRoll = [-1, 0];
            }
        }
        updateVisualization();
    },

    render: function() {
        this.renderColor(this.renderContext.children[0]);
        this.renderString(this.name, 1);
        this.renderString(this.score(), 13);
        this.frames.concat([this.bonusRolls]).slice(0, this.currentRoll[0] + 1)
            .forEach(function(ea, idx) {
                this.renderFrame(ea, idx + 2);
            }, this)
        this.renderInteractionButtons();
    },
    renderString: function(str, idx) {
        this.renderContext.children[idx].innerHTML = str;
    },
    renderColor: function(htmlNode) {
        while (htmlNode.lastChild) {
            htmlNode.removeChild(htmlNode.lastChild);
        }
        var color = document.createElement('colorLegend');
        color.style.backgroundColor = Color.intToStr(this.color);
        htmlNode.appendChild(color);
    },
    renderFrame: function(frame, idx) {
        this.renderContext.children[idx].innerHTML = frame;
    },
    renderInteractionButtons: function() {
        var cell = this.renderContext.children[this.renderContext.children.length - 1];
        while (cell.lastChild) {
            cell.removeChild(cell.lastChild);
        }
        if (this.currentRoll[0] >= 0) {
            var roll = document.createElement('button');
            roll.innerText = 'roll';
            roll.addEventListener('click', this.randomRoll.bind(this));
            cell.appendChild(roll);
        }
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
    var length = scores && scores.children[0] && scores.children[0].children.length || 0
    Array.range(length).forEach(function(ea) {
        var td = document.createElement('td');
        td.appendChild(document.createTextNode(optContent && optContent[ea] || ''));
        tr.appendChild(td);
    })
    return tr;
};
