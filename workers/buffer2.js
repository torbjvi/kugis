importScripts('../libs/javascript.util.js', '../libs/jsts.js', '../underscore.js'); 

var reader = new jsts.io.GeoJSONReader();
var parser =  new jsts.io.GeoJSONParser();
function correctRings(poly){
  _.each(poly.geometry.coordinates, function(ring){
    var isWrapped =_.isEqual(ring[0], ring.slice(-1)[0])
    if(!isWrapped){
      ring.push(ring[0])
    }
  })
  return poly;
}
onmessage = function(evt) {
  
  	geojson = evt.data.geojson;
  	var featureCollection = { features: [], type: "FeatureCollection", properties: { kugis: true }};
  	var i = 0;
	while(geojson.features.length > 0)  {

			var f = geojson.features.shift();
			f = correctRings(f);
			var input = reader.read(f);
			input.geometry.normalize();
		    var buffer = input.geometry.buffer(evt.data.dist);
		    buffers = parser.write(buffer);
		    f.geometry = buffers;
		    f.properties["kugisCreated"] = "true";
		    featureCollection.features.push(f);
		    i++;
		    if(i%10 == 0)
		    	postMessage({msg: "update", geojson: geojson.features.length});

	}
	postMessage({ msg:"done", fc: featureCollection });
}