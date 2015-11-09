var React = require('react');
var NESComponent = require('./NESComponent.jsx');
var FlappyComponent = require('./FlappyComponent.jsx');
var InfoComponent = require('./InfoComponent.jsx');
var Brain = require('../brain');

var AppComponent = React.createClass({
    brain : null,
    currentGame : null,

    getInitialState : function() {
        return {
            testTickCount: 0,
        };
    },

    onLoaded : function(component) {
        this.brain = new Brain(component.getBrainAdapter());
    },

    onTrainTick : function() {
        this.brain.train();
        this.setState({testTickCount : this.state.testTickCount + 1});
    },

    onTestTick : function() {
        this.brain.test();
    },

    render : function() {
        return (
            <div id="app">
                <InfoComponent
                    brain={this.brain} 
                    testTickCount={this.state.testTickCount} />
                <FlappyComponent
                    onLoaded={this.onLoaded}
                    onTrainTick={this.onTrainTick}
                    onTestTick={this.onTestTick}  />
            </div>
        );
	}
});

module.exports = AppComponent;
