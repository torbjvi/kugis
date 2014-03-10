Sidebar.Tool.Dissolve = Sidebar.Tool.extend({
	title: "Dissolve",
	_droppableText: "Drop a layer here to Dissolve it!",
	afterDrop: function (event, context) {
		this.toggleOptions();
		var message = "test";
		
		layer = event.draggable[0].this._layer;
		var geojson = layer.toGeoJSON();
		 this.execute(geojson);

	},
	execute: function (geojson, callback, name) {
		var dissolveWorker = new Worker('workers/dissolve2.js');
		var features = [];
		var map = this._map;	
		logger.newLog("Dissolve", geojson.features.length, 0);
		dissolveWorker.postMessage({geojson: geojson});
		dissolveWorker.onmessage = function (e) {
			if(e.data.msg)
				logger.step();
			else {
				logger.done();
				logger = new Logger();
				if(callback) {
					callback(e.data.geojson)
				}
				else {
					var color = "black";
					var l = L.geoJson(e.data.geojson, { style: {color: color } });
					if(!name)
						name = layer.fileName+"_diss";
					layerlist.addLayer(name, e.data.geojson, color);
					
				}
			}
		};
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