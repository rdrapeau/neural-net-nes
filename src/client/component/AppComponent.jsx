var React = require('react');
var NESComponent = require('./NESComponent.jsx');
var FlappyComponent = require('./FlappyComponent.jsx');
var FlappyBrain = require('../flappyBrain');

var AppComponent = React.createClass({
    brain : null,
    currentGame : null,

    getInitialState : function() {
        return {};
    },

    onLoadNESGame : function(nesComponent) {
        console.log(nesComponent);
    },

    onLoadFlappyGame : function(component, FPS) {
        // this.brain = new FlappyBrain(this.onAction, this.onGetState, this.onStart, this.onTrainingEnd, FPS);
        this.currentGame = component;

        // this.brain.train();
    },

    onStart : function() {
        this.currentGame.onStart();
    },

    onAction : function(action) {
        this.currentGame.onAction(action);
    },

    onGetState : function() {
        return this.currentGame.onGetState();
    },

    onTrainingEnd : function() {
        // this.brain.test();
    },

    render : function() {
        // <NESComponent onLoaded={this.onLoadNESGame} />
        return (
            <div id="app">
                <FlappyComponent onLoaded={this.onLoadFlappyGame} />
            </div>
        );
	}
});

module.exports = AppComponent;