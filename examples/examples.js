const { FunBunyan } = require('../')
const funBunyan = new FunBunyan({
    streams: [
        {
            level: 'info',
            stream: process.stdout
        }        
    ],
    console: {
        stderr: console.log,
        stringify: 'dynamic'  // Values: 'dynamic' or 'simple'
    }
});

funBunyan.trace('This Trace is NEVER displayed');
if (funBunyan.info()) {
    console.log("Default log level is INFO!");
} else {
    throw new Error('Default log level is not INFO.');
}
funBunyan.level("trace");
funBunyan.trace('Hello from a %s trace %s!', 'fun-bunyan', 'log');
funBunyan.debug({hey: 'there'}, 'Hello from a fun-bunyan debug log!');
funBunyan.info('Hello from a %s info %s!', 'fun-bunyan', 'log');
funBunyan.warn('Hello from a %s warning %s!', 'fun-bunyan', 'log')
funBunyan.error(new Error('Example Error'), 'Hello from a %s error %s!', 'fun-bunyan', 'log');
funBunyan.fatal(new Error('Example Fatal Error'), 'Hello from a %s fatal error %s!', 'fun-bunyan', 'log');

const aloha = {
    weather: 'sunny',
    temp: 34.2
};
funBunyan.error({aloha, err: new Error('Hawaii Error')}, 'Hello from Hawaii with an Object');

const hello = {
    foo: 'bar',
    bar: true,
    baz: 123.45
};
hello.barf = hello; // Include a circular reference!
funBunyan.info({
    hello
}, 'Testing Info with an Object!');


// Hang tight for a bit, while we check the logged Object!
funBunyan.warn('CTRL-C to exit the node process.')
process.stdin.resume();