Sidebar.Tool.AddArea = Sidebar.Tool.extend({
title: "AddArea",
_droppableText: "Instruction text",
afterDrop: function (event, context) {
	var layer = event.draggable[0].this._layer;
	var reproj
	var layers = layer.getLayers();
	var i = 0;
	var callback = function (geojson) {
			var reader = new jsts.io.GeoJSONReader();
			var feature = reader.read(geojson);
			if(!l.feature.properties)
				l.feature.properties = {};
			l.feature.properties["area"] =  feature.geometry.getArea().toFixed(2);
			l.bindPopup(Object.keys(feature.properties).map(function(k){
		        return k + ": " + feature.properties[k] ;
		      }).join("<br />"),{maxHeight:200});
			i++;
			WktUtils.reprojectGeoJson(layers[i].feature, "EPSG:4326",  "EPSG:32632", 3, callback);
	};
	WktUtils.reprojectGeoJson(layers[i].feature, "EPSG:4326",  "EPSG:32632", 3, callback);
	
},		
});
