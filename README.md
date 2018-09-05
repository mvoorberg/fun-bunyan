# fun-bunyan
Easy console logging for Node apps. Use the fun-bunyan console stream for projects that are already using Bunyan, or create a new Bunyan instance for development with one line of code.

Powered by [bunyan](https://github.com/trentm/node-bunyan).

[![Build Status](https://travis-ci.org/4umfreak/fun-bunyan.svg?branch=master)](https://travis-ci.org/4umfreak/fun-bunyan)
[![Coverage Status](https://coveralls.io/repos/github/4umfreak/fun-bunyan/badge.svg?branch=master)](https://coveralls.io/github/4umfreak/fun-bunyan?branch=master)


## Installation

    npm install fun-bunyan

## Usage

To use the logger:

```javascript
const { FunBunyan } = require('fun-bunyan');
const logger = new FunBunyan();

logger.info('Yay, so easy!');
logger.info(`Yay, it\s Bunyan, so I won't have to edit all my logging code
                in three months when I stream logs to XYZ service!`);
logger.info({
    feels: 'liberating'
}, "Like a weight removed from my shoulders.");
```


Add random streams to a new FunBunyan instance. 
Here we can see the raw JSON from Bunyan interlaced with the cleaned-up output from fun-bunyan.

```javascript
const { FunBunyan } = require('fun-bunyan');
const funBunyan = new FunBunyan({
    streams: [
        {
            level: 'info',
            stream: process.stdout
        }        
    ]
});
funBunyan.info(`Yay, I'm seeing double!`);
```

Configure the output with a few simple options:

```javascript
const { FunBunyan } = require('fun-bunyan');
const funBunyan = new FunBunyan({
    streams: [
        {
            level: 'info',
            stream: process.stdout
        }        
    ],
    level: 'trace',
    console: {
        logTemplate: '{%s}*(%s)*%s',
        errorTemplate: '{%s}#(%s)#%s\n%s',
        stdout: console.log,
        stddir: console.dir,
        stderr: console.error,
        stringify: 'simple',
        colors: false
    }
});
funBunyan.trace(`Yay, We're tracing.`);
funBunyan.trace(`Yay, You can see everything twice.`);

const hello = {
    foo: 'bar',
    bar: true,
    baz: 123.45
};
hello.barf = hello; // Include a circular reference!

funBunyan.trace({ hello }, `Yay, Objects passed to log methods are safely stringified. 
                                Even ones with circular references!`);
```
By default, the output is colorized, but you could turn colors off by passing false, or provide (some or all of) your own color map.

```javascript
const { FunBunyan } = require('fun-bunyan');
const funBunyan = new FunBunyan({
    console: {
        colors: {
            "bold": "\x1b[1m",
            "reset": "\x1b[0m",
            "time": "\x1b[34m",
            "fatal": "\x1b[35m",
            "error": "\x1b[31m",
            "warn": "\x1b[33m",
            "info": "\x1b[36m",
            "debug": "\x1b[37m",
            "trace": "\x1b[90m"
        }
    }
});
funBunyan.trace(`Yay, We're using a custom color map!`);
```

If you're already using Bunyan for your logging, you can simply add the fun-bunyan
console stream to your existing streams array when running in development.

```javascript
const bunyan = require('bunyan');
const funBunyan = require('fun-bunyan');

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

logger.info(`Look Ma, I'm logging to the console!`);
```