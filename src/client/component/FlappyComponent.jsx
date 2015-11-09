var React = require('react');
var Constants = require('../flappybird/Constants');
var FlappySimulator = require('../flappybird/FlappySimulator');
var FlappyRenderer = require('../flappybird/FlappyRenderer');
var FlappyAdapter = require('../adapter/FlappyAdapter');

var RENDER_FPS = 60.0;
var FRAMES_PER_TICK = 18;

var FlappyComponent = React.createClass({
    flappySimulator : null,
    flappyRenderer : null,
    flappyAdapter : null,
    frameCount : 0,
    trainingDone : false,

    getInitialState : function() {
        return {
            renderEnabled : true,
            fps : RENDER_FPS
        };
    },

    getBrainAdapter : function() {
        return this.flappyAdapter;
    },

    componentDidMount : function() {
        this.flappySimulator = new FlappySimulator();
        this.flappyRenderer = new FlappyRenderer(this.flappySimulator, "flappyCanvas");
        this.flappyAdapter = new FlappyAdapter(this.flappySimulator, () => {
            this.trainingDone = true;
        });

        this.props.onLoaded(this);

        // Start game loop
        this.loop();

        // Lets jump when there is a browser key event
        // so humans can play
        window.addEventListener("keyup", (function() {
            this.flappySimulator.onAction(1);
        }).bind(this), false);
    },

    loop : function() {
        // Always run the simulation
        if (!this.flappySimulator.isRunning()) {
            this.frameCount = 0;
            this.flappyAdapter.onGameStart();
        }

        // Update the simulation
        this.flappySimulator.update();

        // Render
        if (this.state.renderEnabled) {
            this.flappyRenderer.render();
        }

        // Update the parent ticker
        this.frameCount++;
        if (this.frameCount > FRAMES_PER_TICK) {
            if (this.trainingDone) {
                this.props.onTestTick();
            } else {
                this.props.onTrainTick();
            }
            this.frameCount = 0;
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