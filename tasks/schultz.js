/*
 * grunt-module
 * https://github.com/reputation.com/grunt-module
 *
 * Copyright (c) 2012 Reputation.com
 * Authored by: Jeff Harnois jeff.harnois@reputation.com
 * Licensed under the MIT license.
 *
 */

'use strict';

var parserlib = require('parserlib'),
    util = require('util'),
    _ = require('underscore'),
    $ = require('jQuery') || require('jquery');

module.exports = function(grunt) {
  grunt.registerMultiTask('schultz', 'Take css files, convert them to JSON, and replace the markup in a file with inline styles.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      force: true
    });

    if (this.target[this.target.length - 1] === '/') {
      grunt.fail.warn("never use path as filename");
    }

    grunt.verbose.writeflags(options, 'Options');

    var parser = new parserlib.css.Parser(),
        joss = function(file) {
          var parserlib = require('parserlib'),
              contents = '',
              currentRule = {},
              i = 0,
              len = null,
              css = {};
          var parser = new parserlib.css.Parser();
          
          parser.addListener("startrule", function(event){
            // save the current rule we are on for use in the property listen
            for (i = 0,len = event.selectors.length; i < len; i++){
               var selector = event.selectors[i];
               currentRule = selector.text;
            }
          });
          
          parser.addListener("property", function(event){
              // check to see if we have a relative url('') anywhere [ !== url('//') ] and add a mustache var to resolve the path
              if (event.value.text.indexOf("url('/") !== -1 && event.value.text.indexOf("url('//") === -1) {
                var str = event.value.text,
                    n;
                n = str.replace(/url\('\//g,"url('http://{{cdn}}/");
                event.value.text = n;
              }
              // check to see if the rule already has a property
              var currProp = css[currentRule] || '';
              // save the property and value to the rule.
              css[currentRule] = currProp + event.property.text + ': ' + event.value.text + (event.important ? "!important" : "") + ';';
          });
          
          parser.parse(grunt.file.read(file));
          
          return css;
        },
        processSchultz = function(src, dest) {
          var contents = '',
              css = {};
          _.each(src.files.css, function(filepath) {
            css[filepath] = joss(filepath);
          });

          _.each(src.files.tpl, function(filepath) {
            var raw = grunt.file.read(filepath);
            // escape partial mustache calls because jQuery.html() strips them out
            raw = raw.replace(/\{\{>/g,"{{&gt;");
            // save the file content to a jquery instance so that we can simply use jquery selectors
            $(raw).appendTo('body');
            $.each(css, function(key, value) {
              for (var i in value) {
                $.each($(i), function(index) {
                  // save the current inline style if it exists
                  var attr = $(this).attr('style') || '';
                  // append the new style with the old style
                  $(this).attr('style',attr+value[i]);
                });
              }
            });
            contents = $('body').html();
            // unescape the mustache partial calls for profit and success
            contents = contents.replace(/\&gt\;/g,">");
            // clear out the html from the body so when we save the file we aren't getting previous contents
            $('body').html('');
          });

          try {
            grunt.file.write(dest, contents);
          } catch (e) {
            grunt.log.error();
            grunt.verbose.error(e);
            grunt.fail.warn('Cannot write to '+dest,contents);
          }
        };

    processSchultz(this.data, this.target);
  });
};