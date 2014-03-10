importScripts('../libs/javascript.util.js', '../libs/jsts.js');

var reader = new jsts.io.GeoJSONReader();
var parser =  new jsts.io.GeoJSONParser();
onmessage = function(evt) {
  
  	gj1 = evt.data.gj1;
  	gj2 = evt.data.gj2;
  	var intersections = [];
		
		while(gj1.features.length > 0) {
			var f = gj1.features.shift();
			var f1 = reader.read(f);
			var g1 = f1.geometry;
			if(!f.properties["kugisCreated"])
				g1 = g1.buffer(0.0000000001);
			for(var i = 0; i<gj2.features.length;i++) {
				var f2 = gj2.features[i]; 
				var fe2 = reader.read(f2);
				g2 = fe2.geometry;
				if(!f2.properties["kugisCreated"])
					g2 = g2.buffer(0.0000000001);
			 	var intersection = g1.intersection(g2);
			 	if(!intersection.isEmpty()) {
			 		var properties = {};
			 		for(var key in f.properties) {
			 			properties["1."+key] = f.properties[key];
			 		}
			 		for(var key in f2.properties) {
			 			properties["2."+key] = f2.properties[key];
			 		}
			 		properties["kugisCreated"] = "true";
			 		intersections.push({ geometry: intersection, properties: properties });
			 	}
				 postMessage("");
			}
			
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