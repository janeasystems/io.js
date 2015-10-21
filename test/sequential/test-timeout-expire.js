'use strict';

setTimeout(function() {
  console.log('Timeout should not have had time to expire.');
  process.exit(1);
}, 10 * 60 * 1000);
