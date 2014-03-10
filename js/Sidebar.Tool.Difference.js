Sidebar.Tool.Difference = Sidebar.Tool.extend({
	title: "Difference",
	wkt1: null,
	wkt2: null,
	_droppableText: "Drop a layer here, then drop the layer you want to subtract from it",
	afterDrop: function (event, context) {
		
		logger.newLog("Difference...");
		layer = event.draggable[0].this._layer;
		var pointLayer = false;
		var reader = new jsts.io.GeoJSONReader();
		var gj = layer.toGeoJSON();
		var fc = reader.read(gj);
		var parser = new jsts.io.WKTParser();
		var wkts = null;
		while(fc.features.length > 0) {
			var f = fc.features.shift();
			var g = f.geometry;
			if(g.CLASS_NAME == "jsts.geom.MultiPolygon" || g.CLASS_NAME == "jsts.geom.MultiLineString" || g.CLASS_NAME == "jsts.geom.MultiPoint") {
						for(var i = 0; i<g.getNumGeometries();i++) {
							var sg = g.getGeometryN(i);
							var wkt = new Wkt.Wkt(parser.write(sg));
							if(wkts == null) 
								wkts = wkt;
							else
								wkts = wkts.merge(wkt);
						}
					}
			else {
				var wkt = new Wkt.Wkt(parser.write(f.geometry));
				if(wkts == null) 
					wkts = wkt;
				else {
					
						wkts = wkts.merge(wkt);
		
					}
			}
		}
		if(this.wkt1 == null) {
			this.wkt1 = wkts;

		}
		else {
			this.wkt2 = wkts;
		}
		if((this.wkt1 != null) && (this.wkt2 != null)) {
			this.toggleOptions();
			var wkts = WktUtils.difference(this.wkt1,this.wkt2);
			d = wkts.toObject();
			var color = "black";
				
			d.setStyle({
			          opacity:1,
			          fillOpacity:0.7,
			          radius:6,
			          color: color
    			});
			var group = L.featureGroup().addLayer(d);
			group.fileName = "Difference";
			layerlist.addLayer(group, color);
			this.wkt1 = null;
			this.wkt2 = null;
		}
		logger.done();

	},
	createToolOptions: function () {
		element = L.DomUtil.create("div", "tool-options");
		this._droppable = L.DomUtil.create('div', 'droppable');

		var con = this;
		$(this._droppable).droppable({
			drop: function (event, ui) {
				con.afterDrop(ui, con);
			}
		});
		this._droppable.appendChild(document.createTextNode(this._droppableText));
		element.appendChild(this._droppable);
		return element;
	}
		
});