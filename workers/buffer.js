importScripts('../libs/javascript.util.js', '../libs/jsts.js'); 

var wkts = null;
var buffers = [];
var reader = new jsts.io.WKTReader();
var parser =  new jsts.io.WKTParser();
onmessage = function(evt) {
  
  if(wkts === null)
  	wkts = evt.data.queue;
  
    var input = reader.read(wkts.shift());
    var buffer = input.buffer(evt.data.dist);
    buffers.push(parser.write(buffer));
 if(wkts.length > 1)
  postMessage({buffers: buffers, queue: wkts.length, dist: evt.data.dist});
else 
	postMessage({buffers: buffers, queue: wkts.length, dist: evt.data.dist});

}