/*
 * grunt-schultz
 * https://github.com/reputation.com/grunt-schultz
 *
 * Copyright (c) 2012 Reputation.com
 * Authored by: Jeff Harnois jeff.harnois@reputation.com
 * Licensed under the MIT license.
 * "I know nuzzing!"
 * Docs: 
 *   parser-lib git://github.com/nzakas/parser-lib.git
 *   jQuery https://github.com/coolaj86/node-jquery
 */

module.exports = function(grunt) {

  // Please see the grunt documentation for more information regarding task and
  // helper creation: https://github.com/cowboy/grunt/blob/master/docs/toc.md
  
  // ==========================================================================
  // GLOBAL VARS
  // ==========================================================================
  var file = grunt.file,
      log = grunt.log,
      config = grunt.config;

  // ==========================================================================
  // TASKS
  // ==========================================================================

  grunt.registerMultiTask('schultz', 'Take css files, convert them to JSON, and replace the markup in a file with inline styles.', function() {
    // make sure we get some data
    if (!this.data) { return false; }
    
    // make sure the destination we get is a file, not a path
    if (this.file.dest[this.file.dest.length - 1] === '/') {
       grunt.fatal('never use path as filename');
       return false;
     }
    
    // send unprocessed file.src object to schultz, it will extract css and tpl as it needs
    var files = this.file.src;
    grunt.file.write(this.file.dest, grunt.helper('schultz', files));

    // Fail task if errors were logged.
    if (this.errorCount) { return false; }
    console.log('no errors');
    // 
    // // Otherwise, print a success message.
    grunt.log.writeln('File "' + this.file.dest + '" created.');
  });

  // ==========================================================================
  // HELPERS
  // ==========================================================================
  
  grunt.registerHelper('joss', function(file) {
    var parserlib = require('parserlib'),
        contents = '',
        currentRule = {},
        css = {};
    var parser = new parserlib.css.Parser();
    
    parser.addListener("startrule", function(event){
      // save the current rule we are on for use in the property listen
      for (var i=0,len=event.selectors.length; i < len; i++){
         var selector = event.selectors[i];
         currentRule = selector.text;
      }
    });
    
    parser.addListener("property", function(event){
        // check to see if we have a relative url('') anywhere [ !== url('//') ] and add a mustache var to resolve the path
        if (event.value.text.indexOf('url(\'/') !== -1 && event.value.text.indexOf('url(\'//') === -1) {
          var str = event.value.text;
          var s = str.slice(0,5);
          var e = str.slice(6,str.length);
          event.value.text = s+'//{{cdn}}/'+e;
        }
        // check to see if the rule already has a property
        var currProp = css[currentRule] || '';
        // save the property and value to the rule.
        css[currentRule] = currProp + event.property.text + ': ' + event.value.text + (event.important ? "!important" : "") + ';';
    });
    
    parser.parse(grunt.file.read(file));
    
    return css;
  });
  
  grunt.registerHelper('schultz', function(files) {
    var $ = require('jQuery'),
        contents = '',
        css = {};
    files.css.map(function(filepath) {
      var raw = grunt.file.read(filepath);
        // send css to Joss to be converted into an object
        css[filepath] = grunt.helper('joss', filepath);
    });
    files.tpl.map(function(filepath) {
      var raw = grunt.file.read(filepath);
      // escape partial mustache calls because jQuery.html() strips them out
      raw = raw.replace(/\{\{>/g,"{{&gt;");
      // save the file content to a jquery instance so that we can simply use jquery selectors
      $(raw).appendTo('body');
      $.each(css, function(key, value) {
        for (var i in value) {
          // save the current inline style if it exists
          var attr = $(i).attr('style') || '';
          // append the new style with the old style
          $(i).attr('style',attr+value[i]);
        }
      });
      contents = $('body').html();
      // unescape the mustache partial calls for profit and success
      contents = contents.replace(/\&gt\;/g,"\>");
      // clear out the html from the body so when we save the file we aren't getting previous contents
      $('body').html('');
    });
    return contents;
  });

};