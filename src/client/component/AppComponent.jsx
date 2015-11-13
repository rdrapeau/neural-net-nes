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
            brainJSON: ""
        };
    },

    onLoaded : function(component) {
        this.brain = new Brain(component.getBrainAdapter());
    },

    onTick : function() {
        if (this.state.isTraining) {
            this.brain.train();
            this.setState({trainTickCount : this.state.trainTickCount + 1});

            // Update brain JSON every N ticks
            if ((this.state.trainTickCount + 1) % 100 == 0) {
                this.setState({brainJSON : JSON.stringify(this.brain.getBrainJSON())});
            }
        } else {
            this.brain.test();
        }
    },

    loadBrain : function() {
        var json = null;
        try {
            json = JSON.parse(this.refs.brainJSON.value);
        } catch (e) {
            this.setState({brainJSON : "INVALID BRAIN"});
        }

        if (json) {
            this.brain.loadBrain(json);
        }
    },

    toggleTrain : function() {
        this.setState({isTraining : !this.state.isTraining});
    },

    render : function() {
        return (
            <div id="app">
                <div>
                    <button onClick={this.toggleTrain}>Mode: {this.state.isTraining ? "Train" : "Test"}</button>
                </div>

                <div>
                    <textarea ref="brainJSON" value={this.state.brainJSON}></textarea>
                    <button onClick={this.loadBrain}>Load Brain</button>
                </div>

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
