Sidebar.Tool.Buffer = Sidebar.Tool.extend({
	title: "Buffer",
	_droppableText: "Drop a layer here to buffer!",
	afterDrop: function (event, context) {
		this.toggleOptions();
		var message = "test";
		bufferWorker = new Worker('workers/buffer.js');
		dissolveWorker = new Worker('workers/dissolve.js');
		var pointLayer = false;
		var distance = context._distance.value;
		layer = event.draggable[0].this._layer;
		 bufferWorker.onmessage = function(evt) {
		 	var queue = evt.data.queue;
		 	logger.step();
		 	if(queue != 0) {
		 		bufferWorker.postMessage(evt.data);
		 	}
		 	if(queue == 0) {
		 					wktsb = evt.data.buffers;
					 	
					 		var color = "black";
							var group = L.featureGroup();
							
							group.fileName = layer.fileName+"_buffer"+distance+"m";
					 		for(var i = 0; i<wktsb.length;i++) {
					 			wktsb[i] = new Wkt.Wkt(wktsb[i]);
					 			wktsb[i].components = WktUtils.transformWktToWGS84(wktsb[i].components);
								var d = wktsb[i].toObject();
								group.addLayer(d);
								d.setStyle({
							          opacity:1,
							          fillOpacity:0.7,
							          radius:6,
							          color: color
				    			});
							}
							dissolve = true;
							logger.done();
							logger = new Logger();
				if(!dissolve) {
							layerlist.addLayer(group, color);
				}
				else{
					Sidebar.Tool.Dissolve.prototype.execute(group);
				}
					 	
		 	}

		  };

		for(key in layer._layers) {
					if(layer._layers[key].feature != null &&layer._layers[key].feature.geometry.type == "Point")
						pointLayer = true;
					break;
		}
		var wkts;
		if(!pointLayer) {
			wkts = WktUtils.layerToWkt(layer);
		}
		else {
			wkts = WktUtils.pointLayerToWkt(layer);
		}

			logger.newLog("Buffer", wkts.length, 0);
		for(var i = 0;i<wkts.length;i++) {
			wkts[i].components = WktUtils.transformWktComponentsToWebMercator(wkts[i].components);
			wkts[i] = wkts[i].write();
		}
		
		bufferWorker.postMessage({buffers:[], queue: wkts, dist: distance});
	},
	createToolOptions: function () {
		element = L.DomUtil.create("div", "tool-options");
		element.appendChild(document.createTextNode("Distance: "));
		this._distance = L.DomUtil.create("input", "buffer-distance");
		this._distance.value = 100;
		L.DomEvent.addListener(this._distance, "click", L.DomEvent.stopPropagation);
		element.appendChild(this._distance);
		element.appendChild(document.createTextNode(" m"));
		element.appendChild(L.DomUtil.create("br", ""));
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