module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/schultz.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    clean: {
      all: ["/tmp/schultz"],
      options: {
        force: true
      }
    },

    schultz: {
      "/tmp/schultz/test.js": {
        files: {
          css: [
            'test/css/src.css'
          ],
          tpl: [
            'test/templates/src.mustache'
          ]
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }
  });

  // Load local tasks.
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-internal');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Whenever the 'test' task is run, first this plugin's task(s),
  // then test the result.
  grunt.registerTask('test', ['clean', 'schultz', 'nodeunit']);

  // Default task.
  grunt.registerTask('default', ['jshint', 'test']);

};
