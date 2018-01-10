const FIELD_NAME_COLUMNS = 14;

const printTable = output => {
  Object.keys(output).forEach(item => {
    const field = item.replace(/_/g, ' ');
    const times = output[item];
    const spaces = ' '.repeat(FIELD_NAME_COLUMNS - field.length);
    console.log(`${field}${spaces}${times}`);
  });
}

const printInvalidArg = arg => {
  return `"${arg}" is not a valid cron string.`;
}

module.exports = { printTable, printInvalidArg }
