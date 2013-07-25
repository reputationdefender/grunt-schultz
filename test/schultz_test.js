/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

'use strict';

var grunt = require('grunt');

exports.schultz = {
  long: function(test) {
    test.expect(1);
    
    // contents = grunt.helper('schultz',f),
    var contents = grunt.file.read('/tmp/schultz/test.js'),
        expected = grunt.file.read("test/output.mustache");
    
    test.equal(contents, expected, 'Should return markup with inline styles.');
    test.done();
  }
};