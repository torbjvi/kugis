Sidebar.Tool.Intersect = Sidebar.Tool.extend({
	title: "Intersection",
		wkt1: null,
	wkt2: null,
	_droppableText: "Drop two layers here in succession to create an intersection between them.",
	afterDrop: function (event, context) {
		
		logger.newLog("Intersection...");
		layer = event.draggable[0].this._layer;
		var pointLayer = false;
		if(this.wkt1 == null) {
			for(key in layer._layers) {
						if(layer._layers[key].feature != null &&layer._layers[key].feature.geometry.type == "Point")
							pointLayer = true;
						break;
			}
			if(!pointLayer) {
				this.wkt1 = WktUtils.layerToWkt(layer);
			}
			else {
				this.wkt1 = WktUtils.pointLayerToWkt(layer);
			}
		}
		else {
			for(key in layer._layers) {
						if(layer._layers[key].feature != null &&layer._layers[key].feature.geometry.type == "Point")
							pointLayer = true;
						break;
			}
			if(!pointLayer) {
				this.wkt2 = WktUtils.layerToWkt(layer);
			}
			else {
				this.wkt2 = WktUtils.pointLayerToWkt(layer);
			}
		}
		if((this.wkt1 != null) && (this.wkt2 != null)) {
			this.toggleOptions();
			var wkts = WktUtils.intersect(this.wkt1,this.wkt2);
			d = wkts.toObject();
			var color = colors.next();
				
			d.setStyle({
			          opacity:1,
			          fillOpacity:0.7,
			          radius:6,
			          color: color
    			});
			var group = L.featureGroup().addLayer(d);
			group.fileName = "Intersection";
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