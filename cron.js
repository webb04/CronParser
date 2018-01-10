const { cronParser } = require('./cronParser.js');
const { printInvalidArg, printTable } = require('./print.js');
const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const days = ['mon', 'tues', 'wed', 'thu', 'fri', 'sat', 'sun'];
const args = process.argv.pop().split(' ');

const invalidExit = () => {
  console.log(printInvalidArg(args.join(' ')));
  process.exit(1);
}

if (args.length != 6) {
  invalidExit();
}

const [minute, hour, dayOfMonth, month, dayOfWeek, command] = args;

// No mixed use of days and months
days.map(day => {
  if (month.indexOf(day) > -1) {
    invalidExit();
  }
})

// No mixed use of days and months
months.map(month => {
  if (dayOfWeek.indexOf(month) > -1) {
    invalidExit();
  }
})

const output = cronParser(args);
printTable(output);
