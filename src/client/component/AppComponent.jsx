var React = require('react');
var NESComponent = require('./NESComponent.jsx');
var FlappyComponent = require('./FlappyComponent.jsx');
var Brain = require('../brain');

var AppComponent = React.createClass({
    brain : null,
    currentGame : null,

    getInitialState : function() {
        return {};
    },

    onLoaded : function(component) {
        this.brain = new Brain(component.getBrainAdapter());
    },

    onTrainTick : function() {
        this.brain.train();
    },

    onTestTick : function() {
        this.brain.test();
    },

    render : function() {
        return (
            <div id="app">
                <FlappyComponent
                    onLoaded={this.onLoaded}
                    onTrainTick={this.onTrainTick}
                    onTestTick={this.onTestTick} />
            </div>
        );
	}
});

module.exports = AppComponent;