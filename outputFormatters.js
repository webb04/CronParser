// 7 => 1 2 3 4 5 6 7
const oneToN = n => [...Array(n).keys()].map(key => ++key).join(' ');

// 7 => 0 1 2 3 4 5 6
const zeroToN = n => [...Array(n).keys()].join(' ');

const toIndex = {
  jan: '1',
  feb: '2',
  mar: '3',
  apr: '4',
  may: '5',
  jun: '6',
  jul: '7',
  aug: '8',
  sep: '9',
  oct: '10',
  nov: '11',
  dec: '12',
  mon: '1',
  tue: '2',
  wed: '3',
  thu: '4',
  fri: '5',
  sat: '6',
  sun: '7'
};

const sortNumber = (a, b) => {
  [a, b] = getIndex([a, b]);
  return parseInt(a) - parseInt(b);
}

const getIndex = ([a, b]) => {
  if (a.length == 3) a = toIndex[a.toLowerCase()];
  if (b.length == 3) b = toIndex[b.toLowerCase()];
  return [a, b];
}

const formatSteps = (arg, total, zeroIndex) => {
  const modulus = total / arg.slice(2);
  let output = zeroIndex ? '0' : '';
  const loop = zeroIndex ? modulus : modulus + 1;
  for (i = 1; i < loop; i++) {
    if (arg.slice(2) * i <= total) {
      output += ` ${arg.slice(2) * i}`;
    }
  }
  return output.trim();
}

const formatRange = (arg, total) => {
  let [start, end] = getIndex(arg.split('-'));
  if (end > total || start > end) return `Argument not a valid cron field`;
  let output = start;
  for (i = ++start; i <= end; i++) {
    output += ` ${i}`;
  }
  return (start === end) ? start : output;
}

const format = (arg, total, zeroIndex) => {
  // */15
  if (arg.slice(0, 2) == '*/') {
    arg = formatSteps(arg, total, zeroIndex);
  }

  // 1,2,3
  if (arg.includes(',')) {
    arg = arg.replace(/,/g, ' ');
  }

  // 1-5 ... mon-wed
  if (arg.includes('-')) {
    arg = formatRange(arg, total);
  }

  // *
  if (arg == '*') {
    arg = zeroIndex ? zeroToN(total) : oneToN(total);
  }

  // jan, feb, mar ... mon, tue, wed
  const distinctOutputs = Array.from(new Set(arg.split(' ')));
  const sortedOutput = distinctOutputs.sort(sortNumber);
  const output = sortedOutput
    .map(value => value.length == 3 ? `${toIndex[value.toLowerCase()]}` : `${value}`)
    .join(' ')
    .trim()

  // if we have an invalid argument - TODO: much better to do this at the start before parsing
  return (isNaN(parseInt(output.replace(/ /g, '')))) ? `Argument not a valid cron field` : output;
};

module.exports = { format };
