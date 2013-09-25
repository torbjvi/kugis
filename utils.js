var WktUtils = {};
	WktUtils.layerToWkt = function (layer) {
		
		console.log(layer);
		var wkts = [];
		layer.eachLayer(function (l) {
			        var wkt = new Wkt.Wkt();

// Deconstruct an existing point (or "marker") feature
		wkt.fromObject(l);
		wkts.push(wkt);
// "[ {x: 10, y: 30} ]"
		});
		var w = wkts[0];
		for(var i = 1; i<wkts.length; i++) {
			w.merge(wkts[i]);
		}
		return w;
	
	}; 
	WktUtils.pointLayerToWkt = function (layer) {

		var wkts = [];
		layer.eachLayer(function (l) {
		var wkt = new Wkt.Wkt();

// Deconstruct an existing point (or "marker") feature
		wkt.read("POINT("+l._latlng.lng+" "+l._latlng.lat+")");
		wkts.push(wkt);
// "[ {x: 10, y: 30} ]"
		});
		var w = wkts[0];
		for(var i = 1; i<wkts.length; i++) {
			w.merge(wkts[i]);
		}
		return w;
	
	}; 
	WktUtils.transformWktComponentsToWebMercator = function (c) {
		 if(Array.isArray(c)) {
		 	var e = [];
		 	for(var i = 0; i<c.length;i++) {
		 		e.push(WktUtils.transformWktComponentsToWebMercator(c[i]));
		 	}
		 }
		 else {
			var firstProjection = '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs ';
			var secondProjection = "+proj=utm +zone=32 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ";
			//I'm not going to redefine those two in latter examples.
			
		 	return proj4(firstProjection,secondProjection,c);
		 }
		return e;

	};
	WktUtils.transformWktToWGS84= function (c, dist) {
		if(Array.isArray(c)) {
		 	var e = [];
		 	for(var i = 0; i<c.length;i++) {
		 		e.push(WktUtils.transformWktToWGS84(c[i]));
		 	}
		 }
		 else {
			var firstProjection = '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs ';
			var secondProjection = "+proj=utm +zone=32 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ";
			//I'm not going to redefine those two in latter examples.
			
		 	return proj4(secondProjection,firstProjection,c);;
		 }
		return e;
	};
	WktUtils.buffer = function (wkt, distance) {
	var reader = new jsts.io.WKTReader();

    var input = reader.read(wkt);	
    //var input = reader.read('POLYGON ((-69 -90, -69 -90, -69 -90, -69 -90, -69 -90, -69 -90, -69 -90, -69 -90, -69 -90, -69 -90, -69 -90, -69 -90))');
    console.log(input);
    var buffer = input.buffer(distance);
    
    var parser = new jsts.io.WKTParser();
    buffer = parser.write(buffer);
    return buffer;
	};
	WktUtils.overlay = function (wkt1, wkt2) {
	var reader = new jsts.io.WKTReader();

    var input = reader.read(wkt1);
    var input2 = reader.read(wkt2);	
    //var input = reader.read('POLYGON ((-69 -90, -69 -90, -69 -90, -69 -90, -69 -90, -69 -90, -69 -90, -69 -90, -69 -90, -69 -90, -69 -90, -69 -90))');
    var buffer = input.union (input2);
    
    var parser = new jsts.io.WKTParser();
    overlay = parser.write(buffer);
    return overlay;
	}
