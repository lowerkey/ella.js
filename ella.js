
// ella.js
// Joshua Moore
// 2013-10-19

/* Imports */
var fs = require('fs');
var PegWalker = require('./WalkPEG.js').PegWalker;

/* Utility Functions */

// path 2 string
var p2s = function(path){
    var buf = fs.readFileSync(path);
    return buf.toString('utf-8');
}

/* Building the Parser */
console.log('loading parser...');
var js_grammar_path = '../node_modules/pegjs/examples/javascript.pegjs';
var js_grammar_buffer = fs.readFileSync(js_grammar_path);
var js_grammar_string = js_grammar_buffer.toString('utf-8')
var js_parser = require('./js_parser.js'); 

/* Parse the file described in arguments */
console.log('loading ubigraph...');
var u = require('../node-ubigraph/ubigraph.js');
var ubigraph = new u.Ubigraph();
ubigraph.clear();
var noop = function(){};
var error = function(err){
    console.log(err);
};
var label_vertex = function(id, label){
    ubigraph.setVertexAttribute(id, 'label', label, noop);
};

var edgeFromParent = function(context){
    var child = context;
    var parent = child.parent;
    while(!(parent.hasOwnProperty('vid')) && parent.hasOwnProperty('parent')){
        parent = parent.parent;
    }
    ubigraph.newEdge(parent.vid, child.vid, function(err, id){
        ubigraph.setEdgeAttribute(id, 'oriented', 'true');
    });
};

console.log('setting up walker');
var getVisitor = require(process.argv[2]).getVisitor;

process.argv.slice(3).forEach(function(val, index, array){
    console.log('parsing', val);
    var parse_tree = js_parser.parse(p2s(val));
    
    console.log('traversing', val);
    var visitor = getVisitor();

    visitor.ubigraph.newVertex(function(err, id){
        visitor.ubigraph.clear(function(){
            visitor.ubigraph.setVertexAttribute(id, 'color', '#00FF00', function(err){
                visitor.visit(parse_tree, {vid: id});
            });
        });
    });

});
