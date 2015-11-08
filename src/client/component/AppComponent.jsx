var React = require('react');
var NESComponent = require('./NESComponent.jsx');
var FlappyBirdComponent = require('./FlappyBirdComponent.jsx');
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

    onLoadFlappyGame : function(component) {
        this.brain = new FlappyBrain(this.onAction, this.onGetState, this.onStart);
        this.currentGame = component;

        this.brain.train();
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

    render : function() {
        // <NESComponent onLoaded={this.onLoadNESGame} />
        return (
            <div id="app">
                <FlappyBirdComponent onLoaded={this.onLoadFlappyGame} />
            </div>
        );
	}
});

module.exports = AppComponent;