importScripts('javascript.util.js', 'jsts.js'); 


onmessage = function(evt) {

  
  var reader = new jsts.io.WKTReader();
  var parser =  new jsts.io.WKTParser();
  var wkts = evt.data;
    if(!Array.isArray(wkts)) {
      wkts = [wkts];
    }
    else {
      var queue = [];
      for(var i = 0; i<wkts.length;i=i+2) {
        if((i+1)>(wkts.length-1)) {
          queue.push(wkts[i]);
        }
        else {
         var wkt1 = reader.read(wkts[i]);
         var wkt2 = reader.read(wkts[i+1]);
         var union = wkt1.union(wkt2);
         union = parser.write(union);
         queue.push(union);
        }
      }
    }
  postMessage(queue);
}