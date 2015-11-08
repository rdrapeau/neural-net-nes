var React = require('react');
var FlappyStart = require('../../vendor/flappy/main');

var FlappyBirdComponent = React.createClass({
    getInitialState : function() {
        return {};
    },

    componentDidMount : function() {
        console.log(FlappyStart);
        FlappyStart(this);
    },

    render : function() {
        return (
            <div id="flappyBird">
                <div id="gamecontainer">
                    <div id="gamescreen">
                        <div id="sky" className="animated">
                            <div id="flyarea">
                            <div id="ceiling" className="animated"></div>
                            <div id="player" className="bird animated"></div>
                            <div id="bigscore"></div>
                            <div id="splash"></div>
                            <div id="scoreboard">
                                <div id="medal"></div>
                                <div id="currentscore"></div>
                                <div id="highscore"></div>
                                <div id="replay"><img src="assets/replay.png" alt="replay"></img></div>
                            </div>
                        </div>
                    </div>
                    <div id="land" className="animated"><div id="debug"></div></div>
                    </div>
                </div>
            </div>
        );
	}
});

module.exports = FlappyBirdComponent;