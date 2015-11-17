var React = require('react');
var Constants = require('../flappybird/Constants');
var FlappySimulator = require('../flappybird/FlappySimulator');
var FlappyRenderer = require('../flappybird/FlappyRenderer');
var FlappyAdapter = require('../adapter/FlappyAdapter');

var RENDER_FPS = 60.0;
var FRAMES_PER_TICK = 8;

var FlappyComponent = React.createClass({
    flappySimulator : null,
    flappyRenderer : null,
    flappyAdapter : null,
    frameCount : 0,
    lastScore : 0,

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

        this.props.onLoaded(this);

        // Start game loop
        this.loopShell();

        // Lets jump when there is a browser key event
        // so humans can play
        window.addEventListener("keyup", (function() {
            this.flappySimulator.onAction(1);
            return true;
        }).bind(this), false);
    },

    loopShell : function() {
        if (!this.state.renderEnabled) {
            for (var i = 0; i < 300; i++) {
                // Loop hard core, losing some liquidity in
                // event loop (thus losing updates to the DOM)
                this.loop();
            }
        } else {
            // Loop once per time out,
            // Allows more liquidity in event loop (thus better timed)
            this.loop();
        }

        var timePerFrame = (1 / this.state.fps) * 1000.0;
        setTimeout(this.loopShell, timePerFrame);
    },

    loop : function() {
        // Always run the simulation
        if (!this.flappySimulator.isRunning()) {
            this.frameCount = 0;
            this.flappyAdapter.onGameStart();

            this.setState({gameCount : this.state.gameCount + 1});
        }

        var lastScore = this.flappySimulator.getScore();

        // Update the simulation
        this.flappySimulator.update();

        var scored = this.flappySimulator.getScore() - lastScore > 0;

        // Render
        if (this.state.renderEnabled) {
            this.flappyRenderer.render();
        }

        // Update the parent ticker
        this.frameCount++;

        // Update our brain if we have ticked over a threshold,
        // have died, or have scored.
        if (this.frameCount > FRAMES_PER_TICK ||
            this.flappySimulator.isDead() ||
            scored) {
            if (this.flappySimulator.isRunning()) {
                this.props.onTick();
            }
            this.frameCount = 0;
        }
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
