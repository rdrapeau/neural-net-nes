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

    // return the deepqlearn brain for display
    getBrain : function() {
        return this.brain.brain;
    },

    printBrain : function() {
        console.log(JSON.stringify(this.brain.getBrainJSON()));
    },

    render : function() {
        return (
            <div id="app">
                <button onClick={this.printBrain}>Print Brain</button>
                <FlappyComponent
                    onLoaded={this.onLoaded}
                    onTrainTick={this.onTrainTick}
                    onTestTick={this.onTestTick} 
                    getBrain={this.getBrain} />
            </div>
        );
	}
});

module.exports = AppComponent;
