
module.exports = {
    PegWalker: function(type_callbacks, init, generic_visit){
        var that = this;
        
        this.visit_helper = function(node, context){
            if(node === undefined){
                return;
            }
            if(!node.hasOwnProperty('type')){
                return;
            }

            var callback = that.type_callbacks[node.type];
            if(callback){
                callback.call(that, node, context);
            }else{
                if(that.hasOwnProperty('generic_visit')){
                    that.generic_visit.call(that, node, context);
                }
            };
        };

        this.visit = function(node_s, context){
            var local_context = {
                parent: context
            };
            if(Array.isArray(node_s)){
                for(var i=0; i<node_s.length; i++){
                    this.visit_helper(node_s[i], local_context);
                }
            }else{
                this.visit_helper(node_s, local_context);
            }
        };

        this.type_callbacks = type_callbacks || {};
        if(typeof(init) == 'function'){
            init.call(this);
        }
        
        if(typeof(generic_visit) == 'function'){
            this.generic_visit = generic_visit;
        }
    }
};
