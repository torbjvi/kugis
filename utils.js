var WktUtils = {};
	WktUtils.layerToWkt = function (layer) {
		var wkts = [];
		layer.eachLayer(function (l) {
				var wkt = new Wkt.Wkt();
				wkt.fromObject(l);
				wkts.push(wkt);
		});
		return wkts;
	
	}; 
	WktUtils.pointLayerToWkt = function (layer) {

		var wkts = [];
		layer.eachLayer(function (l) {
		var wkt = new Wkt.Wkt();
		wkt.read("POINT("+l._latlng.lng+" "+l._latlng.lat+")");
		wkts.push(wkt);
		});
		return wkts;
	
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
	WktUtils.transformWktToWGS84= function (c) {
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
	WktUtils.buffer = function (wkts, distance) {
	if(!Array.isArray(wkts)) {
		var wkts = [wkts];
	}
	for(var i=0;i<wkts.length;i++) {
			var reader = new jsts.io.WKTReader();

    	 var parser = new jsts.io.WKTParser();
    	 var wkt = new Wkt.Wkt();
	
			wkts[i].components = WktUtils.transformWktComponentsToWebMercator(wkts[i].components);
		 var input = reader.read(wkts[i].write());
		 var buffer = input.buffer(distance);
		 wkts[i] = new Wkt.Wkt(parser.write(buffer));
		 wkts[i].components = WktUtils.transformWktToWGS84(wkts[i].components);
		 
	}
		return wkts;
	};
	WktUtils.union = function (wkt1, wkt2) {
	var reader = new jsts.io.WKTReader();

    var input = reader.read(wkt1.write());
    var input2 = reader.read(wkt2.write());	
    //var input = reader.read('POLYGON ((-69 -90, -69 -90, -69 -90, -69 -90, -69 -90, -69 -90, -69 -90, -69 -90, -69 -90, -69 -90, -69 -90, -69 -90))');
    var union = input.union(input2);
    
    var parser = new jsts.io.WKTParser();
    union = parser.write(union);
    return new Wkt.Wkt(union);
	};
	WktUtils.dissolve = function(wkts) {
		var j = 1;
		j++
		if(!Array.isArray(wkts))
			return wkts;
		var wkt = wkts[0];
		for(var i = 1; i<wkts.length;i++) {
			wkt = WktUtils.union(wkt, wkts[i]);
		}
		return wkt;					
	}
	WktUtils.union2 = function(wkts) {
		if(wkts.length == 1) {
			return wkts[0];
		}
		var pass = wkt[0];
		for(var  i = 1; i<wkts.length;i++) {
				pass.push(WktUtils.union(pass, wkts[i]));
			
		}
		return pass;

	}
	WktUtils.intersect =function(wkts1, wkts2) {
		var reader = new jsts.io.WKTReader();
		var dissolve1 = WktUtils.dissolve(wkts1);
		var dissolve2 = WktUtils.dissolve(wkts2);
		var wkt1 = reader.read(dissolve1.write());
		var wkt2 = reader.read(dissolve2.write());
		var intersect = wkt1.intersection(wkt2);
		var parser = new jsts.io.WKTParser();
		return new Wkt.Wkt(parser.write(intersect));
	}
	WktUtils.difference =function(wkts1, wkts2) {
		var reader = new jsts.io.WKTReader();
		var dissolve1 = WktUtils.dissolve(wkts1);
		var dissolve2 = WktUtils.dissolve(wkts2);
		var wkt1 = reader.read(dissolve1.write());
		var wkt2 = reader.read(dissolve2.write());
		var intersect = wkt1.difference(wkt2);
		var parser = new jsts.io.WKTParser();
		return new Wkt.Wkt(parser.write(intersect));
	}