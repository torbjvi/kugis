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

  	gj1 = evt.data.gj1;
  	gj2 = evt.data.gj2;
  	
  	var holes = [];
  	var intersections = [];
  		var geometries = [];
		

		while(gj1.features.length > 0) {
			var f = gj1.features.shift();

			var f1 = reader.read(f);
			var g1 = f1.geometry;

			for(var i = 0; i<gj2.features.length;i++) {
				f2 = gj2.features[i];
				g2 = reader.read(f2.geometry);
				g1 = g1.difference(g2);
			}
			f.properties["kugisCreated"] = "true";
			intersections.push({ geometry: g1, properties: f.properties });

			postMessage("");
		}
  	var featureCollection = { features: [], type: "FeatureCollection", properties: { kugis: true }};
	

	for(var i = 0; i<intersections.length; i++) {
  		var intersection = intersections[i];
  		var g = intersection.geometry;
  		var n = g.getNumGeometries();
  		for(var j = 0; j<n; j++) {
  			var geom = g.getGeometryN(j);
  			var feature = {
  				type: "Feature",
  				geometry: parser.write(geom),
  				properties: intersection.properties
  			};
  			featureCollection.features.push(feature);
  		}
  	}
	
	postMessage({ msg:"done", fc: featureCollection });
};