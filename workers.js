
var jstsworker = cw({
    buffer: function(a, b, cb) {
    	importScripts('attache.array.min.js');
		importScripts("javascript.util.js");
		importScripts("jsts.js");
        cb( a + b );
    }
});