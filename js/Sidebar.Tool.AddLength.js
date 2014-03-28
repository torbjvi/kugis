Sidebar.Tool.AddLength = Sidebar.Tool.extend({
title: "AddLength",
_droppableText: "Instruction text",
afterDrop: function (event, context) {
	var layer = event.draggable[0].this._layer;
	var reproj
	var parser = layer.eachLayer(function (l) {
		var geoFeature = l.feature;
		
		var callback = function (geojson) {
			var reader = new jsts.io.GeoJSONReader();
			var feature = reader.read(geojson);
			l.feature.properties["length"] =  feature.geometry.getLength().toFixed(2);
			if(!l.feature.properties)
				l.feature.properties = {};
			l.feature.properties["area"] =  feature.geometry.getArea().toFixed(2);
			l.bindPopup(Object.keys(feature.properties).map(function(k){
		        return k + ": " + feature.properties[k] ;
		      }).join("<br />"),{maxHeight:200});
		}
		WktUtils.reprojectGeoJson(geoFeature, "EPSG:4326",  "EPSG:32632", 3, callback);
	});
},		
});
