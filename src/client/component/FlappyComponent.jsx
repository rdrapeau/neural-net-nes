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
        var FPS = 200.0;
        var timePerFrame = (1 / FPS) * 1000.0;

        this.flappySimulator = new FlappySimulator();
        this.flappyRenderer = new FlappyRenderer(this.flappySimulator, "flappyCanvas");

        // Start the game loop
        setInterval((function() {
            // Update the simulation
            this.flappySimulator.update();

            // Render the simulation
            this.flappyRenderer.render();
        }).bind(this), timePerFrame);

        // Lets jump when there is a browser key event
        // so humans can play
        window.addEventListener("keyup", (function() {
            this.flappySimulator.onAction(1);
        }).bind(this), false);

        this.props.onLoaded(this, FPS);
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