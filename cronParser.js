const { printInvalidArg } = require('./print.js');
const { format } = require('./outputFormatters.js');

const cronParser = args => {
  if (args.length != 6) {
    return printInvalidArg(args.join(' '));
  }

  const [minute, hour, dayOfMonth, month, dayOfWeek, command] = args;

  return {
    minute: format(minute, 60, true),
    hour: format(hour, 24, true),
    day_of_month: format(dayOfMonth, 31, false),
    month: format(month, 12, false),
    day_of_week: format(dayOfWeek, 7, false),
    command
  }
}

module.exports = { cronParser };
