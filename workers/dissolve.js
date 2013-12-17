importScripts('../libs/javascript.util.js', '../libs/jsts.js'); 
var wkts = [];
var reader = new jsts.io.WKTReader();
var parser =  new jsts.io.WKTParser();
onmessage = function(evt) {


  
  if(evt.data.polygon === null) {
    wkts = evt.data.queue;
    var input = reader.read(wkts.shift());
    postMessage({polygon: parser.write(input), queue: wkts.length });
  }
  else {
      var input = reader.read(wkts.shift());
      var input2 = reader.read(wkts.shift());
      var union = input2.union(input);
      if(wkts.length == 0) {
        polygon = parser.write(union);
      }
      else {
        polygon = " ";
        wkts.push(parser.write(union));
      }
    postMessage({polygon: polygon, queue: wkts.length });
  }
}