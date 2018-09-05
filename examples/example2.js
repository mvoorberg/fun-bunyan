const bunyan = require('bunyan');
const funBunyan = require('../index.js')


const streams = [
    // Log to Stackdriver or other...
    // stackdriver.stream(options.level || 'info');
];

if (process.env.NODE_ENV === 'development') {
    streams.push({
        stream: funBunyan.stream(),
        type: "raw",
        level: "info",
    });
}

const logger = bunyan.createLogger({
    name: 'example',
    streams
});

logger.info(`Look Ma, No hands!`);
