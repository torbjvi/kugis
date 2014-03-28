importScripts('../libs/proj4.js'); 



reprojectCoordinates = function (c, proj4StrFrom, proj4StrTo, precision) {
		if(Array.isArray(c[0])) {
		 	var e = [];
		 	for(var i = 0; i<c.length;i++) {
		 		e.push(reprojectCoordinates(c[i], proj4StrFrom, proj4StrTo));
		 	}
		 }
		 else {
		 	var coords = proj4(proj4StrFrom,proj4StrTo,c);
		 	if(precision) {
		 		coords[0] = coords[0].toFixed(precision);
		 		coords[1] = coords[1].toFixed(precision);
		 	}
		 	return coords;
		 }
		 postMessage({msg:"update"});
		return e;
	}
onmessage = function(evt) {
  
  	geojson = evt.data.geojson;
  	proj4stringFrom = evt.data.proj4stringFrom;
  	proj4stringTo = evt.data.proj4stringTo;
  	precision = evt.data.precision;
  	if(geojson.features) {
		for(var i = 0; i<geojson.features.length; i++) {
			geojson.features[i].geometry.coordinates = reprojectCoordinates(geojson.features[i].geometry.coordinates, proj4stringFrom, proj4stringTo, precision); 
		}
	}
	else {
		geojson.geometry.coordinates = reprojectCoordinates(geojson.geometry.coordinates, proj4stringFrom, proj4stringTo, precision); 
	}
	postMessage({msg: "done", geojson: geojson});
}