'use strict';
const common = require('../../common');
const assert = require('assert');

if (!common.isWindows) {
  common.skip('Windows-specific test');
  return;
}

function test(modname) {
  const mod1 = require(modname.toUpperCase());
  const mod2 = require(modname.toLowerCase());
  assert.equal(mod1, mod2);
}

test('./build/Release/binding');
