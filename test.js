const { cronParser } = require('./cronParser.js');
const COLUMNS = 50;

const validInputs = [
  {
    // Spec example
    '*/15 0 1,5 * 1-5 /usr/bin/find': {
      minute: '0 15 30 45',
      hour: '0',
      day_of_month: '1 5',
      month: '1 2 3 4 5 6 7 8 9 10 11 12',
      day_of_week: '1 2 3 4 5',
      command: '/usr/bin/find'
    }
  },
  {
    // test all
    '0 2 * * * backup.sh': {
      minute: '0',
      hour: '2',
      day_of_month: '1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31',
      month: '1 2 3 4 5 6 7 8 9 10 11 12',
      day_of_week: '1 2 3 4 5 6 7',
      command: 'backup.sh'
    }
  },
  {
    // test range
    '0 5,17 20-25 * 2 /scripts/script.sh': {
      minute: '0',
      hour: '5 17',
      day_of_month: '20 21 22 23 24 25',
      month: '1 2 3 4 5 6 7 8 9 10 11 12',
      day_of_week: '2',
      command: '/scripts/script.sh'
    }
  },
  {
    // all *
    '* * * * * monitor.sh': {
      minute: '0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59',
      hour: '0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23',
      day_of_month: '1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31',
      month: '1 2 3 4 5 6 7 8 9 10 11 12',
      day_of_week: '1 2 3 4 5 6 7',
      command: 'monitor.sh'
    }
  },
  {
    // alphanumeric days
    '0 17 * * sun /scripts/script.sh': {
      minute: '0',
      hour: '17',
      day_of_month: '1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31',
      month: '1 2 3 4 5 6 7 8 9 10 11 12',
      day_of_week: '7',
      command: '/scripts/script.sh'
    }
  },
  {
    // comma seperated and every n
    '*/10 * */4 3,8,12 7 /wasm/web.rs': {
      minute: '0 10 20 30 40 50',
      hour: '0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23',
      day_of_month: '4 8 12 16 20 24 28',
      month: '3 8 12',
      day_of_week: '7',
      command: '/wasm/web.rs'
    }
  },
  {
    // alphanumeric months
    '10,20,30 1-10 4 jan,may,aug * quality.py': {
      minute: '10 20 30',
      hour: '1 2 3 4 5 6 7 8 9 10',
      day_of_month: '4',
      month: '1 5 8',
      day_of_week: '1 2 3 4 5 6 7',
      command: 'quality.py'
    }
  },
  {
    // alphanumeric combination
    '0 17 1 dec sun,fri deliveroo.rb': {
      minute: '0',
      hour: '17',
      day_of_month: '1',
      month: '12',
      day_of_week: '5 7',
      command: 'deliveroo.rb'
    }
  },
  {
    // step, range and comma seperated combination
    '0 */4 1-3 */2 5,7 cron.go': {
      minute: '0',
      hour: '0 4 8 12 16 20',
      day_of_month: '1 2 3',
      month: '2 4 6 8 10 12',
      day_of_week: '5 7',
      command: 'cron.go'
    }
  },
  {
    // test day ordering
    '0 4,17 3 * sun,mon cron.test.js': {
      minute: '0',
      hour: '4 17',
      day_of_month: '3',
      month: '1 2 3 4 5 6 7 8 9 10 11 12',
      day_of_week: '1 7',
      command: 'cron.test.js'
    }
  },
  {
    // test day ordering
    '0 4,17,3,4,5 3-7 * sun,mon,tue cron.test.js': {
      minute: '0',
      hour: '3 4 5 17',
      day_of_month: '3 4 5 6 7',
      month: '1 2 3 4 5 6 7 8 9 10 11 12',
      day_of_week: '1 2 7',
      command: 'cron.test.js'
    }
  },
  {
    // test day range
    '*/3 */2 3 10-12 mon-thu cron.test.js': {
      minute: '0 3 6 9 12 15 18 21 24 27 30 33 36 39 42 45 48 51 54 57',
      hour: '0 2 4 6 8 10 12 14 16 18 20 22',
      day_of_month: '3',
      month: '10 11 12',
      day_of_week: '1 2 3 4',
      command: 'cron.test.js'
    }
  },
  {
    // test duplicate values
    '*/3 */2 3,3,3 10-10 1,1 cron.test.js': {
      minute: '0 3 6 9 12 15 18 21 24 27 30 33 36 39 42 45 48 51 54 57',
      hour: '0 2 4 6 8 10 12 14 16 18 20 22',
      day_of_month: '3',
      month: '10',
      day_of_week: '1',
      command: 'cron.test.js'
    }
  },
  {
    // capital days / months
    '*/3 */2 3 OCT-Dec MON-THU cron.test.js': {
      minute: '0 3 6 9 12 15 18 21 24 27 30 33 36 39 42 45 48 51 54 57',
      hour: '0 2 4 6 8 10 12 14 16 18 20 22',
      day_of_month: '3',
      month: '10 11 12',
      day_of_week: '1 2 3 4',
      command: 'cron.test.js'
    }
  }
];

const invalidInputs = [
  {
    // not enough fields
    '0 17 * * sun,fri': '"0 17 * * sun,fri" is not a valid cron string.'
  },
  {
    // not enough fields
    '0 17 * sun,fri scripts/script.sh': '"0 17 * sun,fri scripts/script.sh" is not a valid cron string.'
  },
  {
    // too many fields
    '0 17 * * * sun,fri /ruby/customers.rb': '"0 17 * * * sun,fri /ruby/customers.rb" is not a valid cron string.'
  },
  {
    // incorrect / input
    '/10 1 1 1 1 crawler.go': {
      minute: 'Argument not a valid cron field',
      hour: '1',
      day_of_month: '1',
      month: '1',
      day_of_week: '1',
      command: 'crawler.go'
    }
  },
  {
    // incorrect spacing
    '** 3 4 5 6 pwd': {
      minute: 'Argument not a valid cron field',
      hour: '3',
      day_of_month: '4',
      month: '5',
      day_of_week: '6',
      command: 'pwd'
    }
  },
  {
    // no input
    '': '"" is not a valid cron string.'
  },
  {
    // value too high input
    '*/8 */7 */6 */88 mon-sun index.js': {
      minute: '0 8 16 24 32 40 48 56',
      hour: '0 7 14 21',
      day_of_month: '6 12 18 24 30',
      month: 'Argument not a valid cron field',
      day_of_week: '1 2 3 4 5 6 7',
      command: 'index.js'
    }
  },
  {
    // decimals
    '*/8 */7 6.5 8 mon-sun index.js': {
      minute: '0 8 16 24 32 40 48 56',
      hour: '0 7 14 21',
      day_of_month: 'Argument not a valid cron field',
      month: '8',
      day_of_week: '1 2 3 4 5 6 7',
      command: 'index.js'
    }
  },
  {
    // range
    '*/8 */7 6-99 8 mon-sun index.js': {
      minute: '0 8 16 24 32 40 48 56',
      hour: '0 7 14 21',
      day_of_month: 'Argument not a valid cron field',
      month: '8',
      day_of_week: '1 2 3 4 5 6 7',
      command: 'index.js'
    }
  },
];

const run = tests => {
  tests.forEach(test => {
    const cronString = Object.keys(test)[0];
    const spaces = Array(COLUMNS - cronString.length).join(' ');
    const outcome = JSON.stringify(cronParser(cronString.split(' '))) === JSON.stringify(test[cronString])
      ? `${cronString}${spaces} ✅`
      : `${cronString}${spaces} 🚫`
    console.log(outcome);
  })
}

console.log(`
----------------- Valid Input Tests -----------------
`);

run(validInputs);

console.log(`
---------------- Invalid Input Tests -----------------
`);

run(invalidInputs);
