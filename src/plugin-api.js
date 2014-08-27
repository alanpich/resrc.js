var hookFunctions = {
    fns: {},
    add: function (hook, fn) {
        this.fns[hook] || (this.fns[hook] = []);
        this.fns[hook].push(fn);
    },
    get: function (hook) {
        return this.fns[hook] || [];
    }
};


var registerPlugin = function (name, pluginFn) {

    resrc[name] = function(options){
        pluginFn(options)
        return resrc;
    }
};

var applyHooks = function(methods){
    for(var hook in methods){
        var fn = methods[hook];
        hookFunctions.add(hook,fn);
    }
}


resrc.plugin = {
    register: registerPlugin,
    hook: applyHooks
}
