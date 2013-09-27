importScripts('javascript.util.js'); 
importScripts('jsts.js'); 

onmessage = function(evt) {

  
  var reader = new jsts.io.WKTReader();
  var parser =  new jsts.io.WKTParser();
  var wkts = evt.data.wkt;
  for(var i = 0;i<wkts.length;i++) { 
    var input = reader.read(wkts[i]);
    var buffer = input.buffer(evt.data.dist);
    wkts[i] = parser.write(buffer);
  }
  postMessage(wkts);
}