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
            trainTickCount: 0,
            isTraining: true,
        };
    },

    onLoaded : function(component) {
        this.brain = new Brain(component.getBrainAdapter());
    },

    onTick : function() {
        if (this.state.isTraining) {
            this.brain.train();
            this.setState({trainTickCount : this.state.trainTickCount + 1});
        } else {
            this.brain.test();
        }
    },

    toggleTrain : function() {
        this.setState({isTraining : !this.state.isTraining});
    },

    render : function() {
        return (
            <div id="app">
                <button onClick={this.toggleTrain}>Mode: {this.state.isTraining ? "Train" : "Test"}</button>
                <InfoComponent
                    brain={this.brain} 
                    trainTickCount={this.state.trainTickCount} />
                <FlappyComponent
                    onLoaded={this.onLoaded}
                    onTick={this.onTick} />
            </div>
        );
	}
});

module.exports = AppComponent;
