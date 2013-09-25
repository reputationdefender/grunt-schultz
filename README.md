# grunt-schultz

Grab a css file, convert it to JSON, and replace the class instances in a file with inline styles

## Getting Started
Install this grunt plugin next to your project's [grunt.js gruntfile][getting_started] with: `npm install grunt-schultz`

Then add this line to your project's `grunt.js` gruntfile:

```javascript
grunt.loadNpmTasks('grunt-schultz');
```

[grunt]: https://github.com/cowboy/grunt
[getting_started]: https://github.com/cowboy/grunt/blob/master/docs/getting_started.md

## Documentation

One of the worst things (in my opinion) about writing HTML emails is needing to inline all the styles so that Gmail will correctly play nicely with them.  Towards that end, this task accomplishes that by allowing you to write a css file and then apply the styles directly to the DOM elements.

It accomplishes this by first turning a css file into JSON, and then loops through each portion of the JSON (with the rule being the key and the property being the value) and applies those to the dom element that corresponds with the rule/key.

so a css rule of

    #main p { font-size: 16px; }
    
would turn into

    { "#main p": "font-size: 16px;" }
    
If our html looked like:

    <div id="main">
        <p>will be targetted</p>
    </div>
    <p>won't be targetted</p>

then after Schultz is run, you'd output:

    <div id="main">
        <p style="font-size: 16px;">will be targetted</p>
    </div>
    <p>won't be targetted</p>
    
which can then be passed off to your rendering engine and sent off as a template or a flat html file ready to be sent as an email.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt][grunt].

## Release History
0.2.0 - 7/35/2013 - updating to support grunt0.4.0

## License
Copyright (c) 2012 Reputation.com 
Licensed under the MIT license.
