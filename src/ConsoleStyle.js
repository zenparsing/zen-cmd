export var ConsoleStyle = {

    green(msg) { return `\x1B[32m${ msg }\x1B[39m` },

    red(msg) { return `\x1B[31m${ msg }\x1B[39m` },

    gray(msg) { `\x1B[90m${ msg }\x1B[39m` },

    bold(msg) { `\x1B[1m${ msg }\x1B[22m` },

};
