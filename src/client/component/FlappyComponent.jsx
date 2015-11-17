var React = require('react');
var Constants = require('../../common/flappybird/Constants');
var FlappySimulator = require('../../common/flappybird/FlappySimulator');
var FlappyRenderer = require('../render/FlappyRenderer');
var FlappyAdapter = require('../../common/adapter/FlappyAdapter');
var FlappyDQNTrainer = require('../../common/trainer/FlappyDQNTrainer');

var RENDER_FPS = 60.0;

var FlappyComponent = React.createClass({
    flappySimulator : null,
    flappyRenderer : null,
    flappyAdapter : null,
    flappyDQNTrainer : null,

    getInitialState : function() {
        return {
            renderEnabled : true,
            gameCount : 0,
            fps : RENDER_FPS,
        };
    },

    getBrainAdapter : function() {
        return this.flappyAdapter;
    },

    componentDidMount : function() {
        this.flappySimulator = new FlappySimulator();
        this.flappyRenderer = new FlappyRenderer(this.flappySimulator, "flappyCanvas");
        this.flappyAdapter = new FlappyAdapter(this.flappySimulator);
        this.flappyDQNTrainer = new FlappyDQNTrainer(
            this.flappySimulator,
            this.flappyAdapter,
            this.props.onTick
        );

        this.props.onLoaded(this);

        // Start game loop
        this.loopShell();

        // Lets jump when there is a browser key event
        // so humans can play
        // window.addEventListener("keyup", (function() {
        //     this.flappySimulator.onAction(1);
        //     return true;
        // }).bind(this), false);
    },

    loopShell : function() {
        if (!this.state.renderEnabled) {
            for (var i = 0; i < 300; i++) {
                // Loop hard core, losing some liquidity in
                // event loop (thus losing updates to the DOM)
                this.flappyDQNTrainer.loop();
            }
        } else {
            // Loop once per time out,
            // Allows more liquidity in event loop (thus better timed)
            this.flappyDQNTrainer.loop();
            // Render
            if (this.state.renderEnabled) {
                this.flappyRenderer.render();
            }
        }

        var timePerFrame = (1 / this.state.fps) * 1000.0;
        setTimeout(this.loopShell, timePerFrame);
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
