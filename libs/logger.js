const colors = {
  blue: [34, 89],
  yellow: [33, 89],
  red: [31, 89],
  cyan: [36, 89],
  green: [32, 89],
  magenta: [35, 89],
  white: [37, 89],
  gray: [30, 89],
  redBright: [91, 39],
  greenBright: [92, 39],
  yellowBright: [93, 39],
  blueBright: [94, 39],
  magentaBright: [95, 39],
  cyanBright: [96, 39],
  whiteBright: [97, 39],
  bgBlack: [40, 49],
  bgRed: [41, 49],
  bgGreen: [42, 49],
  bgYellow: [43, 49],
  bgBlue: [44, 49],
  bgMagenta: [45, 49],
  bgCyan: [46, 49],
  bgWhite: [47, 49],
  bgBlackBright: [100, 49],
  bgRedBright: [101, 49],
  bgGreenBright: [102, 49],
  bgYellowBright: [103, 49],
  bgBlueBright: [104, 49],
  bgMagentaBright: [105, 49],
  bgCyanBright: [106, 49],
  bgWhiteBright: [107, 49],
};

const styles = {
  reset: [0, 0],
  bold: [1, 22],
  dim: [2, 22],
  italic: [3, 23],
  underline: [4, 24],
  inverse: [7, 27],
  hidden: [8, 28],
  strikethrough: [9, 29],
};

/**
    Console.blue
    Console.red
    Console.cyan
    Console.green
    Console.yellow
    Console.magenta
    Console.white
    Console.gray
 */

class Console {
  constructor() {
    this.str = [];
    const ref = { ...colors, ...styles };
    const all = Object.keys(ref);

    all.forEach((d) => {
      const obj = {
        [d]: {
          get() {
            this.str.push(ref[[d]]);
            const self = this;
            const b = function getColor(arg) {
              const reset = `\x1b[${styles.reset[0]}m`;
              /* eslint no-restricted-syntax: "off" */
              /* eslint no-param-reassign: "off" */
              /* eslint no-shadow: "off" */
              for (const d of self.str.reverse()) arg = `\x1b[${d[0]}m${arg}\x1b[${d[1]}m`;
              self.str = [];
              return arg + reset;
            };
            /* eslint no-proto: "off" */
            b.__proto__ = this;
            return b;
          },
        },
      };
      Object.defineProperties(Console.prototype, obj);
    });
  }
}

const ConsoleLog = new Console();

const Logger = {
  /// // // // // // Normal colors // // // // // / // // // / // /
  blue(str) {
    process.stdout.write(ConsoleLog.blue(`${str} \n`));
  },
  red(str) {
    process.stdout.write(ConsoleLog.red(`${str} \n`));
  },
  cyan(str) {
    process.stdout.write(ConsoleLog.cyan(`${str} \n`));
  },
  green(str) {
    process.stdout.write(ConsoleLog.green(`${str} \n`));
  },
  yellow(str) {
    process.stdout.write(ConsoleLog.yellow(`${str} \n`));
  },
  magenta(str) {
    process.stdout.write(ConsoleLog.magenta(`${str} \n`));
  },
  white(str) {
    process.stdout.write(ConsoleLog.white(`${str} \n`));
  },
  gray(str) {
    process.stdout.write(ConsoleLog.gray(`${str} \n`));
  },
  // // // // // // Bold colors // // // // // // // // //
  bold: {
    blue(str) {
      process.stdout.write(ConsoleLog.bold.blue(`${str} \n`));
    },
    red(str) {
      process.stdout.write(ConsoleLog.bold.red(`${str} \n`));
    },
    boldcyan(str) {
      process.stdout.write(ConsoleLog.bold.cyan(`${str} \n`));
    },
    green(str) {
      process.stdout.write(ConsoleLog.bold.green(`${str} \n`));
    },
    yellow(str) {
      process.stdout.write(ConsoleLog.bold.yellow(`${str} \n`));
    },
    magenta(str) {
      process.stdout.write(ConsoleLog.bold.magenta(`${str} \n`));
    },
    white(str) {
      process.stdout.write(ConsoleLog.bold.white(`${str} \n`));
    },
    gray(str) {
      process.stdout.write(ConsoleLog.bold.gray(`${str} \n`));
    },
  },
  // // // // / // // Status colors // // // // // // // /
  warn(str) {
    process.stdout.write(ConsoleLog.yellowBright('Warn: '));
    process.stdout.write(ConsoleLog.yellow(`${(new Date()).toUTCString()}`));
    process.stdout.write(ConsoleLog.whiteBright(': '));
    process.stdout.write(ConsoleLog.white(`${str} \n`));
  },
  error(str) {
    process.stdout.write(ConsoleLog.redBright('Error: '));
    process.stdout.write(ConsoleLog.red(`${(new Date()).toUTCString()}`));
    process.stdout.write(ConsoleLog.whiteBright(': '));
    process.stdout.write(ConsoleLog.white(`${str} \n`));
  },
  debug(str) {
    process.stdout.write(ConsoleLog.blueBright('Debug: '));
    process.stdout.write(ConsoleLog.blue(`${(new Date()).toUTCString()}`));
    process.stdout.write(ConsoleLog.whiteBright(': '));
    process.stdout.write(ConsoleLog.white(`${str} \n`));
  },
  info(str) {
    process.stdout.write(ConsoleLog.greenBright('Info: '));
    process.stdout.write(ConsoleLog.green(`${(new Date()).toUTCString()}`));
    process.stdout.write(ConsoleLog.whiteBright(': '));
    process.stdout.write(ConsoleLog.white(`${str} \n`));
  },
  // // // // // // // // Background colors // // // // // // // // // // //
  bg: {
    blue(str) {
      process.stdout.write(ConsoleLog.bgBlue(`${str} \n`));
    },
    red(str) {
      process.stdout.write(ConsoleLog.bgRed(`${str} \n`));
    },
    cyan(str) {
      process.stdout.write(ConsoleLog.bgCyan(`${str} \n`));
    },
    green(str) {
      process.stdout.write(ConsoleLog.bgGreen(`${str} \n`));
    },
    yellow(str) {
      process.stdout.write(ConsoleLog.bgYellow(`${str} \n`));
    },
    magenta(str) {
      process.stdout.write(ConsoleLog.bgMagenta(`${str} \n`));
    },
    white(str) {
      process.stdout.write(ConsoleLog.bgWhite(`${str} \n`));
    },
    gray(str) {
      process.stdout.write(ConsoleLog.bgBlack(`${str} \n`));
    },
  },
};

module.exports = Logger;
