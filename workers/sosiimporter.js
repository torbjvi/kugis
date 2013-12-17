importScripts('http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min.js','../libs/proj4.js','../libs/SOSI.js.js');
onmessage = function(evt) {


	
		var parser = new SOSI.Parser();

	var sosidata = parser.parse(evt.data.replace(/N�/g, "NØ").replace(/OMR�DE/g, "OMRÅDE"));

	var geojson = sosidata.dumps("geojson", "polygons");
	postMessage(geojson);
	var geojson = sosidata.dumps("geojson", "lines");
	postMessage(geojson);
	var geojson = sosidata.dumps("geojson", "points");
	postMessage(geojson);
}