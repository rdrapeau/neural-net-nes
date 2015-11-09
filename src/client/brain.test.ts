import Brain = require('./brain');

class BrainTest {

    public static setUp(callback) {
        console.log('Set up');
        callback();
    }

    public static tearDown(callback) {
        console.log('Tear Down');
        callback();
    }

    public static unitTestName(test) {
        console.log('First Test');
        test.done();
    }
}

export = BrainTest;
