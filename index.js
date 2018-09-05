'use strict';
const bunyan = require('bunyan');
const util = require('util');
const Stream = require('stream');

const LEVEL_NAMES = {
    10: 'trace',
    20: 'debug',
    30: 'info',
    40: 'warn',
    50: 'error',
    60: 'fatal'
};

const COLORS = {
    "Reset": "\x1b[0m",
    "Bold": "\x1b[1m",
    "Inverse": "\x1b[7m",
    "bgRed": "\x1b[41m",
    "Black": "\x1b[30m",
    "White": "\x1b[37m",
    "Red": "\x1b[31m",
    "Green": "\x1b[32m",
    "Yellow": "\x1b[33m",
    "Blue": "\x1b[34m",
    "Magenta": "\x1b[35m",
    "Cyan": "\x1b[36m",
    "Gray": "\x1b[90m"
}

const COLOR_MAP = {
    "bold": COLORS.Bold,
    "reset": COLORS.Reset,
    "time": COLORS.Blue,
    "fatal": COLORS.Inverse + COLORS.Magenta,
    "error": COLORS.Red,
    "warn": COLORS.Yellow,
    "info": COLORS.Cyan,
    "debug": COLORS.White,
    "trace": COLORS.Gray
};

function createConsoleStream(options) {
    const stringifyOpts = {
        colors: true
    };
    options = options || {};
    const consoleColors = Object.assign({}, COLOR_MAP, options.colors);
    if (options.colors === false) {
        Object.keys(consoleColors).map((color) => {
            consoleColors[color] = '';
        });
        stringifyOpts.colors = false;
    }
    options.errorTemplate = options.errorTemplate || '[%s] [%s]\t%s\n%s';
    options.logTemplate = options.logTemplate || '[%s] [%s]\t%s';
    options.stdout = options.stdout || console.log;
    options.stddir = options.stddir || console.dir;
    options.stderr = options.stderr || console.error;

    // Valid type include:
    // * simple: Circular safe, static JSON.
    // * dynamic: Interactive while the process is running.
    options.stringify = options.stringify || 'dynamic';


    // Create a more succinct stream for local development.
    const consoleStream = new Stream();
    consoleStream.writable = true;
    consoleStream.write = function (obj) {
        const dateString = obj.time.toLocaleString() + ':' + obj.time.getMilliseconds();
        const smallFmtDate = consoleColors.time + dateString + consoleColors.reset;
        const levelName = LEVEL_NAMES[obj.level];
        const levelText = LEVEL_NAMES[obj.level].toUpperCase();
        const level = consoleColors.bold + consoleColors[levelName] + levelText + consoleColors.reset;

        if (obj.err && obj.err.stack) {
            options.stderr(util.format(options.errorTemplate, smallFmtDate, level, obj.msg, obj.err.stack));
        } else {
            options.stdout(util.format(options.logTemplate, smallFmtDate, level, obj.msg));
        }
        // Delete the noise fields.
        ["name", "hostname", "pid", "msg", "err", "level", "time", "v"].map((noise) => {
            delete obj[noise];
        });
        // Print out any remaining keys in the log object
        if (Object.keys(obj).length) {
            if (options.stringify === 'simple') {
                // Print a Circular-safe stringified Object.
                options.stdout(util.inspect(obj, stringifyOpts));
            } else {
                // While the Node process is still alive, it's interactive!
                options.stddir(obj);
            }
        }
    }
    return consoleStream;
}

module.exports = function (options) {
    options = options || {};
    const streamArray = options.streams || [];

    // Add the console output Stream.
    if (options.console !== false) {
        const consoleStream = createConsoleStream(options.console);
        streamArray.push({
            stream: consoleStream,
            type: "raw",
            level: options.level || 'info',
        });
    }

    return bunyan.createLogger({
        name: options.name || 'fun-bunyan',
        streams: streamArray
    });
}