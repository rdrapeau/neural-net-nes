var React = require('react');
var Constants = require('../flappybird/Constants');
var FlappySimulator = require('../flappybird/FlappySimulator');
var FlappyRenderer = require('../flappybird/FlappyRenderer');

var RENDER_FPS = 60.0;

var FlappyComponent = React.createClass({
    flappySimulator : null,
    flappyRenderer : null,

    getInitialState : function() {
        return {
            renderEnabled : true,
            fps : RENDER_FPS
        };
    },

    componentDidMount : function() {
        this.flappySimulator = new FlappySimulator();
        this.flappyRenderer = new FlappyRenderer(this.flappySimulator, "flappyCanvas");

        // Start game loop
        this.loop();

        // Lets jump when there is a browser key event
        // so humans can play
        window.addEventListener("keyup", (function() {
            this.flappySimulator.onAction(1);
        }).bind(this), false);

        this.props.onLoaded(this);
    },

    loop : function() {
        // Update the simulation
        this.flappySimulator.update();

        if (this.state.renderEnabled) {
            this.flappyRenderer.render();
        }

        var timePerFrame = (1 / this.state.fps) * 1000.0;
        setTimeout(this.loop, timePerFrame);
    },

    toggleRender : function() {
        var enabled = this.state.renderEnabled;
        this.setState({
            renderEnabled : !enabled,
            fps : !enabled ? RENDER_FPS : 99999999999.0
        });
    },

    render : function() {
        return (
            <div ref="flappyBird">
                <button onClick={this.toggleRender}>
                    {this.state.renderEnabled ? "Rendering: On" : "Rendering: Off"}
                </button>
                <canvas id="flappyCanvas" width={"" + Constants.GAME_WIDTH} height={"" + Constants.GAME_HEIGHT} />
            </div>
        );
	}
});

module.exports = FlappyComponent;