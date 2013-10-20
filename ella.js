
// ella.js
// Joshua Moore
// 2013-10-19

// Utility Functions

// path 2 string
var p2s = function(path){
    var buf = fs.readFileSync(path);
    return buf.toString('utf-8');
}

// Build the parser
var fs = require('fs');
var PEG = require('pegjs');
var javascript_grammar_path = '../node_modules/pegjs/examples/javascript.pegjs';
var javascript_grammar_buffer = fs.readFileSync(javascript_grammar_path);
var javascript_grammar_string = javascript_grammar_buffer.toString('utf-8')
var javascript_parser = PEG.buildParser(javascript_grammar_string);

// Parse the file described in arguments
process.argv.slice(2).forEach(function(val, index, array){
    console.log(p2s(val)
});
