import Brain = require('./brain');

class TestAdapter {
    public stateSize = 1;
    public numActions = 2;
    public numIterations = 10000;
    public brain = null;

    public gameState = { status: true, features: [Math.random()] };

    public actions = [];
    public onDoneTrainCalled = 0;
    public onActionCalled = 0;
    public getRewardCalled = 0;

    public getGameState() {
        return this.gameState;
    }

    public getReward(gameState, action, newState) {
        this.getRewardCalled++;
        return action ? 1 : -1;
    }

    public onAction(action) {
        this.onActionCalled++;
        this.actions.push(action);
    }

    public onDoneTrain(json) {
        this.onDoneTrainCalled++;
    }
}

class BrainTest {

    private static brain;
    private static adapter;

    public static setUp(callback) {
        BrainTest.adapter = new TestAdapter();
        BrainTest.brain = new Brain(BrainTest.adapter);
        callback();
    }

    public static tearDown(callback) {

        callback();
    }

    public static testConstructorDidReferenceSelf(test) {
        test.strictEqual(
            BrainTest.adapter.brain,
            BrainTest.brain,
            'Brains should be the same object'
        );

        test.done();
    }

    public static testTrainPassedActionsBack(test) {
        BrainTest.adapter.numIterations = 10;
        for (var i = 0; i < BrainTest.adapter.numIterations; i++) {
            BrainTest.brain.train();
        }

        test.strictEqual(
            BrainTest.adapter.onActionCalled,
            BrainTest.adapter.numIterations,
            'onAction should have been called for every train()'
        );

        test.done();
    }

    public static testTrainNullGameState(test) {
        BrainTest.adapter.gameState = null;
        var returnValue = BrainTest.brain.train();

        test.ok(
            !returnValue,
            'train should return false if the gameState is null'
        );

        test.done();
    }

    public static testTrainSimpleModel(test) {
        BrainTest.adapter.numIterations = 3500;
        BrainTest.adapter.gameState = {status : true, features : [0]};
        for (var i = 0; i < BrainTest.adapter.numIterations; i++) {
            BrainTest.brain.train();
        }

        BrainTest.adapter.actions = [];
        for (var i = 0; i < 1000; i++) {
            BrainTest.brain.test();
        }

        var sum = BrainTest.adapter.actions.reduce(function(a, b) { return a + b; });
        var mean = sum / 1000.0;

        var squaredResidualSum = BrainTest.adapter.actions.map(function(a) {
            return Math.pow(a - mean, 2);
        }).reduce(function(a, b) {
            return a + b;
        });

        var variance = squaredResidualSum / 1000.0;
        var espilon = 0.1;

        test.ok(
            mean + espilon >= 1.0 && mean - espilon <= 1.0,
            'Mean should be very close to 1'
        );


        test.ok(
            variance + espilon >= 0.0 && variance - espilon <= 0.0,
            'Variance should be very close to 0'
        );

        test.done();
    }
}

export = BrainTest;
