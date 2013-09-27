importScripts('javascript.util.js'); 
importScripts('jsts.js'); 

onmessage = function(evt) {

  
  var reader = new jsts.io.WKTReader();
  var parser =  new jsts.io.WKTParser();
  var wkts = evt.data;
    if(!Array.isArray(wkts))
      return wkts;
    var wkt = reader.read(wkts[0]);
    for(var i = 1; i<wkts.length;i++) {
      wkt = wkt.union(reader.read(wkts[i]));
    }
  postMessage(parser.write(wkt));
}