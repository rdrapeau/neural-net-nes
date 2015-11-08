var React = require('react');
var Constants = require('../flappybird/Constants');
var FlappySimulator = require('../flappybird/FlappySimulator');
var FlappyRenderer = require('../flappybird/FlappyRenderer');

var FlappyComponent = React.createClass({
    flappySimulator : null,
    flappyRenderer : null,

    getInitialState : function() {
        return {};
    },

    componentDidMount : function() {
        var FPS = 60.0;
        var timePerFrame = (1 / FPS) * 1000.0;

        this.flappySimulator = new FlappySimulator();
        this.flappyRenderer = new FlappyRenderer(this.flappySimulator, "flappyCanvas");

        setInterval((function() {
            // Update the simulation
            this.flappySimulator.update();

            // Render the simulation
            this.flappyRenderer.render();
        }).bind(this), timePerFrame);

        window.addEventListener("keyup", (function() {
            console.log('keyup');
            this.onAction(1);
        }).bind(this), false);

        this.props.onLoaded(this, FPS);
    },

    onStart : function() {
        this.flappySimulator.onAction(1);
    },

    onAction : function(action) {
        this.flappySimulator.onAction(action);
    },

    onGetState : function() {
        return this.flappySimulator.onGetState();
    },

    render : function() {
        return (
            <div ref="flappyBird">
                <canvas id="flappyCanvas" width={"" + Constants.GAME_WIDTH} height={"" + Constants.GAME_HEIGHT} />
            </div>
        );
	}
});

module.exports = FlappyComponent;