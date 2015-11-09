var React = require('react');
var NESComponent = require('./NESComponent.jsx');
var FlappyComponent = require('./FlappyComponent.jsx');
var FlappyBrain = require('../brain');

var AppComponent = React.createClass({
    brain : null,
    currentGame : null,

    getInitialState : function() {
        return {};
    },

    onLoaded : function(component) {
        this.brain = new Brain(component.getBrainAdapter());
    },

    onTick : function() {
        this.brain.train();
    },

    render : function() {
        return (
            <div id="app">
                <FlappyComponent onLoaded={this.onLoaded} onTick={this.onTick} />
            </div>
        );
	}
});

module.exports = AppComponent;