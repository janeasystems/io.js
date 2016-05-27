'use strict';
const common = require('../common');
const assert = require('assert');

if (!common.isWindows) {
  common.skip('Windows-specific test');
  return;
}

test('../fixtures/empty.js');

function test(modname) {
  const mod1 = require(modname.toUpperCase());
  const mod2 = require(modname.toLowerCase());
  assert.equal(mod1, mod2);
}
