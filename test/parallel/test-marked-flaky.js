'use strict';

require('../common');
var assert = require('assert');

assert.ok(process.hrtime()[1] % 2);
