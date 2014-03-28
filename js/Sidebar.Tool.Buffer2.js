Sidebar.Tool.Buffer2 = Sidebar.Tool.extend({
	title: "Buffer",
	_droppableText: "Drop a layer here to buffer!",
	afterDrop: function (event, context) {
		this.toggleOptions();
		var message = "test";
		
		
		var distance = context._distance.value;
		layer = event.draggable[0].this._layer;
		var geojson = layer.toGeoJSON();
		
		this.execute(geojson, distance, this._dissolve.checked, null, layer);

	},
	execute: function (geojson, distance, dissolve, callback, layer) {
		var features = [];
		var bufferWorker = new Worker('workers/buffer2.js');
		var map = this._map;
		var con = this;
		con.asdsadasda = callback;
		con.dissolve = dissolve;
		var _reproject32632cb = function (geojson) {
			//L.geoJson(geojson, { style: { color: "black"() } }).addTo(map);
			if(con.dissolve) { 
				Sidebar.Tool.Dissolve.prototype.execute(geojson, con.asdsadasda, layer.fileName+"_"+distance+"mbuffer" );
			}
			else if(con.asdsadasda != null){
				con.asdsadasda(geojson);
			}
			else {
				var color = "black";
				
				var name = layer.fileName+"_"+distance+"mbuffer";
				
				layerlist.addLayer( name, geojson, color);
			}


		
		};
		var _reproject4326cb= function (geojson) {
			logger.newLog("Buffer:  dist: "+distance, geojson.features.length/10, 0);
			bufferWorker.postMessage({geojson: geojson, dist: distance});
		};


		WktUtils.reprojectGeoJson(geojson, "EPSG:4326",  "EPSG:32632", 3, _reproject4326cb);

	
		
		bufferWorker.onmessage = function (e) {
			logger.step();
			if(e.data.msg === "done") {
				logger.done();
				logger = new Logger();
				WktUtils.reprojectGeoJson(e.data.fc, "EPSG:32632",  "EPSG:4326", 8, _reproject32632cb);
				
			}
		};
	},
	createToolOptions: function () {
		element = L.DomUtil.create("div", "tool-options");
		element.appendChild(document.createTextNode("Distance: "));
		this._distance = L.DomUtil.create("input", "buffer-distance");
		this._distance.value = 100;
		this._dissolve = L.DomUtil.create("input", "checkbox");
		this._dissolve.type = "checkbox";
		this._dissolve.checked = true;
		L.DomEvent.addListener(this._distance, "click", L.DomEvent.stopPropagation);
		element.appendChild(this._distance);
		element.appendChild(document.createTextNode(" m"));
		element.appendChild(L.DomUtil.create("br", ""));
		element.appendChild(document.createTextNode("Dissolve: "));
		element.appendChild(this._dissolve);
		this._droppable = L.DomUtil.create('div', 'droppable');
		L.DomEvent.addListener(this._dissolve, "click", L.DomEvent.stopPropagation);

		var con = this;
		$(this._element).droppable({
			drop: function (event, ui) {
				con.afterDrop(ui, con);
			}
		});
		this._droppable.appendChild(document.createTextNode(this._droppableText));
		element.appendChild(this._droppable);
		return element;
		
	}
});