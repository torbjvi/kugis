importScripts('../libs/javascript.util.js', '../libs/jsts.js'); 


onmessage = function(evt) {

  
  var reader = new jsts.io.WKTReader();
  var parser =  new jsts.io.WKTParser();
  var wkts = evt.data.queue;
  var buffers = evt.data.buffers;
  
    var input = reader.read(wkts.shift());
    var buffer = input.buffer(evt.data.dist);
    buffers.push(parser.write(buffer));
  
  postMessage({buffers: buffers, queue: wkts, dist: evt.data.dist});
}