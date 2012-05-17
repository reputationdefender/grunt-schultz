var grunt = require('grunt');

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

exports['schultz'] = {
  setUp: function(done) {
    // setup here
    done();
  },
  'helper': function(test) {
    test.expect(1);
    // tests here
    var f = {
      css: [
        'test/css/a.css'
      ],
      tpl: [
        'test/templates/a.mustache'
      ]
    },
    contents = grunt.helper('schultz',f),
    expected = '<table>\n  <div style="background-color: #292929; background: url(\'//{{cdn}}/img/patterns/headerbg.png?1336771384\');">This is a test</div>\n  <div class="none" style="display: none;">but I should not be able to read this</div>\n  <div class="article" style="float: left;">\n    <h2>This is a header</h2>\n    <p style="font-size: 14px; font-weight: bold;">This is the first paragraph.</p>\n    <p style="font-size: 14px;">This is the second paragraph.</p>\n  </div>\n  <p style="font-size: 12px;">Isn’t it funny how paragraphs just happen?</p>\n</table>';
    
    test.equal(contents, expected, 'Should return markup with inline styles.');
    test.done();
  }
};