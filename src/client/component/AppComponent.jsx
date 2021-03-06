var React = require('react');
var NESComponent = require('./NESComponent.jsx');
var FlappyComponent = require('./FlappyComponent.jsx');
var InfoComponent = require('./InfoComponent.jsx');
var VisualizeLayersComponent = require('./VisualizeLayersComponent.jsx');
var Brain = require('../../common/Brain');

var AppComponent = React.createClass({
    brain : null,
    currentGame : null,

    getInitialState : function() {
        return {
            trainTickCount: 0,
            isTraining: true
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
                this.refs.brainJSON.value = JSON.stringify(this.brain.getBrainJSON());
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
            this.refs.brainJSON.value = "INVALID";
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
                    <textarea ref="brainJSON"></textarea>
                    <button onClick={this.loadBrain}>Load Brain</button>
                </div>

                <InfoComponent
                    brain={this.brain} 
                    trainTickCount={this.state.trainTickCount} />
                <FlappyComponent
                    onLoaded={this.onLoaded}
                    onTick={this.onTick} />
                <VisualizeLayersComponent
                    brain={this.brain}
                    tickCount={this.state.trainTickCount} />
            </div>
        );
	}
});

module.exports = AppComponent;
