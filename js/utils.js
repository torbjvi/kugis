var WktUtils = {};
	WktUtils.layerToWkt = function (layer) {
		var wkts = [];
		layer.eachLayer(function (l) {
				try {
					var wkt = new Wkt.Wkt();
					wkt.fromObject(l);
					wkts.push(wkt);
				} catch (err) {
					map.removeLayer(l);
				}
		});
		return wkts;
	
	};
	WktUtils.getEpsgString = function (epsgstring, callback) {
		if(Proj4js.defs[epsgstring]) {
			return true;
		}
		else {
			var num = epsgstring.split(":")[1];
			var url =  "http://spatialreference.org/ref/epsg/"+num.toString()+"/proj4js/?jsoncallback=?";
			$.getJSON(url,{} ,function() {  }).done(function() {  });
		}	
	}
	WktUtils.reprojectCoordinates = function (c, proj4StrFrom, proj4StrTo, precision) {
		if(Array.isArray(c[0])) {
		 	var e = [];
		 	for(var i = 0; i<c.length;i++) {
		 		e.push(WktUtils.reprojectCoordinates(c[i], proj4StrFrom, proj4StrTo));
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
		return e;
	}
	WktUtils.reprojectGeoJson = function (geojson, epsgFrom, epsgTo, precision, callback) {
		if(!geojson.features){
			var length = 1;
		}
		else {
			var length = geojson.features.length;
		}
		logger.newLog("Project "+epsgFrom+"->"+epsgTo, length);
		var proj4stringFrom, proj4stringTo;
		var numTo = epsgTo.split(":")[1];
		var numFrom = epsgFrom.split(":")[1];
		var projectWorker = new Worker("workers/project.js");
		projectWorker.onmessage = function (e) {
			if(e.data.msg === "done") {
				logger.done();
				logger = new Logger();
				callback(e.data.geojson);
			}
			else {
				logger.step();
			}

		}
		WktUtils.getEpsgString(epsgFrom);
		WktUtils.getEpsgString(epsgTo);
		var geojson = geojson;
		var callback = callback;
		var intervall = setInterval(function () {
			if(Proj4js.defs["EPSG:"+numTo] && Proj4js.defs["EPSG:"+numFrom] && geojson) {
				clearInterval(intervall);
				proj4stringTo = Proj4js.defs["EPSG:"+numTo];
				proj4stringFrom = Proj4js.defs["EPSG:"+numFrom]
				projectWorker.postMessage({geojson: geojson, proj4stringTo: proj4stringTo, proj4stringFrom: proj4stringFrom, precision: precision});

				
			}

		}, 1000);
	};
	/*WktUtils.pointLayerToWkt = function (layer) {

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
			var coord =  proj4(firstProjection,secondProjection,c);
			coord.x = coord.x.toFixed(3);
			coord.y = coord.y.toFixed(3);
		 	return coord;
		 	
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
	WktUtils.simplify = function (c) {
		 if(Array.isArray(c)) {
		 	var e = [];
		 	for(var i = 0; i<c.length;i++) {
		 		e.push(WktUtils.transformWktComponentsToWebMercator(c[i]));
		 	}
		 }
		 else {
		 	return c;
		 }
		return L.LineUtil.simplify(e, 20);

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
			wkt.merge(wkts[i]);
		}
		return wkt;					
	}/*
	WktUtils.intersect =function(wkts1, wkts2) {
		var reader = new jsts.io.WKTReader();
		var dissolve1 = WktUtils.dissolve(wkts1);
		var dissolve2 = WktUtils.dissolve(wkts2);
		var wkt1 = reader.read(dissolve1.write());
		var wkt2 = reader.read(dissolve2.write());
		var intersect = wkt1.intersection(wkt2);
		var parser = new jsts.io.WKTParser();
		return new Wkt.Wkt(parser.write(intersect));
	} */
	WktUtils.difference =function(wkts1, wkts2) {
		var reader = new jsts.io.WKTReader();
		var dissolve1 = WktUtils.dissolve(wkts1);
		var dissolve2 = WktUtils.dissolve(wkts2);
		var wkt1 = reader.read(dissolve1.write());
		var wkt2 = reader.read(dissolve2.write());
		var intersect = wkt1.difference(wkt2);
		console.log
		var parser = new jsts.io.WKTParser();
		return new Wkt.Wkt(parser.write(intersect));
	}/*
	L.Util.clone = function (o){
	  if(o == null || typeof(o) != 'object')
	    return o;

	  var c = new o.constructor();
	  //Deep clone recursively
	  for(var k in o)
	    c[k] = L.Util.clone(o[k]);

	  return c;
}; */