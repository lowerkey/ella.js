
var Skeleton = require('./WalkPEG.js').PegWalker;

var init = function(){
    var u = require('../node-ubigraph/ubigraph.js');
    this.ubigraph = new u.Ubigraph();
    this.ubigraph.clear();
    this.noop = function(){};
    this.label_vertex = function(id, label){
        this.ubigraph.setVertexAttribute(id, 'label', label, this.noop);
    };
    var that = this;
    this.edgeFromParent = function(context){
        var child = context;
        var parent = child.parent;
        while(!(parent.hasOwnProperty('vid')) 
              && parent.hasOwnProperty('parent')){
            parent = parent.parent;
        }
        this.ubigraph.newEdge(parent.vid, child.vid, function(err, id){
            that.ubigraph.setEdgeAttribute(id, 'oriented', 'true');
        });
    };

    this.visit = function(node_s, context){
        var local_context = {
            parent: context
        };

        this.ubigraph.newVertex(function(err, id){
            local_context.vid = id;
            that.edgeFromParent(local_context);

            if(Array.isArray(node_s)){
                for(var i=0; i<node_s.length; i++){
                    that.visit_helper(node_s[i], local_context);
                }
            }else{
                that.visit_helper(node_s, local_context);
            }
            
        });
    };
    
};

var generic_visit = function(node, context){
    switch(node.type){
    case 'Program':
        this.visit(node.elements, context);

    case 'FunctionCall':
        this.visit(node.arguments, context);
        break;

    case 'VariableStatement':
        this.visit(node.declarations, context);
        break;

    case 'VariableDeclaration':
        this.visit(node.value, context);
        break;

    case 'StringLiteral':
        break;

    case 'PropertyAccess':
        this.visit(node.base, context);
        break;

    case 'Function':
        this.visit(node.elements, context);
        break;

    case 'ReturnStatement':
        this.visit(node.value, context);
        break;

    case 'Variable':
        break;

    case 'NewOperator':
        this.visit(node.constructor, context);
        break;

    case 'WhileStatement':
        this.visit(node.condition, context);
        this.visit(node.statement, context);
        break;

    case 'BinaryExpression':
        this.visit(node.left, context);
        this.visit(node.nright, context);
        break;

    case 'UnaryExpression':
        this.visit(node.expression, context);
        break;

    case 'FunctionCall':
        this.visit(node.name, context);
        break;

    case 'ObjectLiteral':
        break;
        
    case 'RegularExpressionLiteral':
        break;

    case 'This':
        break;

    case 'ArrayLiteral':
        break;
        
    case 'GetterDefinition':
        this.visit(node.body, context);
        break;

    case 'SetterDefinition':
        this.visit(node.param, context);
        this.visit(node.body, context);
        break;

    case 'PropertyAssignment':
        this.visit(node.value, context);
        this.visit(node.value, context);
        break;

    case 'FunctionCallArguments':
        this.visit(node.args, context);
        break;

    case 'PropertyAccessProperty':
        break;

    case 'PostfixExpression':
        this.visit(node.expression, context);
        break;

    case 'ConditionalExpression':
        this.visit(node.condition, context);
        this.visit(node.trueExpression, context);
        this.visit(node.falseExpression, context);
        break;

    case 'Block':
        this.visit(node.statements, context);
        break;

    case 'EmptyStatement':
        break;

    case 'IfStatement':
        this.visit(node.condition, context);
        this.visit(node.ifStatement, context);
        this.visit(node.elseStatement, context);
        break;

    case 'ForStatement':
        this.visit(node.declarations, context);
        break;

    case 'ForInStatement':
        this.visit(node.iterator, context);
        this.visit(node.collection, context);
        this.visit(node.statement, context);
        break;

    case 'ContinueStatement':
        break;

    case 'BreakStatement':
        this.visit(node.value, context);
        break;

    case 'WithStatement':
        this.visit(node.expression, context);
        this.visit(node.clauses, context);
        break;

    case 'CaseBlock':
        this.visit(node.selector, context);
        this.visit(node.statements, context);
        break;

    case 'DefaultClause':
        this.visit(node.statements, context);
        break;

    case 'LabelledStatement':
        this.visit(node.statement, context);
        break;

    case 'ThrowStatement':
        this.visit(node.exception, context);
        break;

    case 'TryStatement':
        this.visit(node.block, context);
        break;

    case 'Catch':
        this.visit(node.identifier, context);
        this.visit(node.block, context);
        break;

    case 'Finally':
        this.visit(node.block, context);
        break;

    case 'DebuggerStatement':
        break;

    case 'AssignmentExpression':
        this.visit(node.left, context);
        this.visit(node.right, context);
        break;
        
    case 'SwitchStatement':
        this.visit(node.expression, context);
        this.visit(node.clauses, context);
        break;

    case 'CaseClause':
        this.visit(this.selector, context);
        this.visit(this.statements, context);
        break;

    default:
        if(node.hasOwnProperty('elements')){
            console.log('Unknown node type, but with elements:', node.type);
            console.dir(node);
            this.visit(node.elements, context);
        }else{
            console.log('Unknown Node Type: ', node.type);
            console.dir(node);
        }
        break;
    }
};

var visit_methods = {

};

module.exports = {
    getVisitor: function(ubigraph){
        return new Skeleton(visit_methods, init, generic_visit);
    }
};
