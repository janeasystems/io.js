'use strict';
const common = require('../common');
const assert = require('assert');
const util = require('util');
const fs = require('fs');
const spawn = require('child_process').spawn;

if (process.argv[2] === 'child') {
  const consoleLog = common.mustCall(() => {
    console.log('{"method": "console.log"}');
  })
  const processSend = common.mustCall(() => {
    process.send({method: 'process.send'}, consoleLog);
  });
  const fsWrite = common.mustCall(() => {
    fs.write(1, '{"method": "process.fs.write"}\n', processSend);
  });
  const stdoutWrite = () => {
    process.stdout.write('{"method": "process.stdout.write"}\n', fsWrite);
  };

  stdoutWrite();
  return;
}

const proc = spawn(process.execPath, [__filename, 'child'], {
  stdio: ['inherit', 'ipc', 'inherit']
});

proc.on('exit', common.mustCall(function(code) {
  assert.strictEqual(code, 0);
}));

let messagesReceived = 0;
proc.on('message', (message) => {
  console.log(`Received: ${util.inspect(message)}`);
  ++messagesReceived;
});

process.on('exit', () => {
  assert.equal(messagesReceived, 4, 'Not all messages has been received');
})
