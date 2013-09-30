Sidebar.Tool.Buffer = Sidebar.Tool.extend({
	title: "Buffer",
	_droppableText: "Drop a layer here to buffer!",
	afterDrop: function (event, context) {
		this.toggleOptions();
		var message = "test";
		bufferWorker = new Worker('workers/buffer.js');
		dissolveWorker = new Worker('workers/dissolve.js');
		
		dissolve = this._dissolve.checked;
		console.log("Drop");
		var pointLayer = false;
		var distance = context._distance.value;
		layer = event.draggable[0].this._layer;
		 bufferWorker.onmessage = function(evt) {
		 	var queue = evt.data.queue;
		 	logger.step();
		 	console.log("message");
		 	if(queue.length != 0) {
		 		bufferWorker.postMessage(evt.data);
		 	}
		 	if(queue.length == 0) {
		 		wktsb = evt.data.buffers;
					 	if(!dissolve) {
					 		var color = colors.next();
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
							layerlist.addLayer(group, color);
							logger.done();

					 	}
					 	else {
					 		for(var i = 0; i<wktsb.length;i++) {
					 			wktsb[i] = new Wkt.Wkt(wktsb[i]);
					 			wktsb[i].components = WktUtils.transformWktToWGS84(wktsb[i].components);
					 			wktsb[i] = wktsb[i].write();
					 		}
					 		dissolveWorker.postMessage(wktsb);
					 	}
					 	
		 	}

		  };
		  dissolveWorker.onmessage = function (evt) {
		  	console.log(evt.data.length);
		  	if(evt.data.length != 1) {
		  		dissolveWorker.postMessage(evt.data);
		  	}
		  	else if(evt.data.length == 1) {
		  		var buffer = evt.data[0];
			  	var color = colors.next();
				var group = L.featureGroup();
				group.fileName = layer.fileName+"_buffer"+distance+"m";
			  	var d = new Wkt.Wkt(buffer).toObject().addTo(layer._map);
			  	group.addLayer(d);
				d.setStyle({
			          opacity:1,
			          fillOpacity:0.7,
			          radius:6,
			          color: color
				});
				layerlist.addLayer(group, color);
				logger.done();
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
		if(dissolve) {
			logger.newLog("Buffer",false, false);
			var wkt = wkts[0];
			for(var i = 1; i<wkts.length;i++)
				wkt.merge(wkts[i]);
			wkts = [wkt];
		}
		else {
			logger.newLog("Buffer", wkts.length, 0);
		}
		for(var i = 0;i<wkts.length;i++) {
			wkts[i].components = WktUtils.transformWktComponentsToWebMercator(wkts[i].components);
			wkts[i] = wkts[i].write();
		}
		
		bufferWorker.postMessage({buffers:[], queue: wkts, dist: distance});
		/*setTimeout(function () {
		wkts = WktUtils.buffer(wkts, distance);
		var color = colors.next();
		var group = L.featureGroup();
		if(dissolve) {
			var pass = WktUtils.dissolve(wkts);
			var d = pass.toObject();
			d.setStyle({
			          opacity:1,
			          fillOpacity:0.7,
			          radius:6,
			          color: color
    			});
			
			group.addLayer(d);
		}
		else {
			for(var i = 0; i<wkts.length;i++) {
				var d = wkts[i].toObject();
				group.addLayer(d);
				d.setStyle({
			          opacity:1,
			          fillOpacity:0.7,
			          radius:6,
			          color: color
    			});
			
			}
		}
			
			
			group.fileName = layer.fileName+"_buffer"+distance+"m";
			layerlist.addLayer(group, color);
		}, 5000);*/

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
		element.appendChild(document.createTextNode("Dissolve: "));
		this._dissolve = L.DomUtil.create("input", "input-dissolve");
		this._dissolve.type = "checkbox";
		this._dissolve.checked = false;
		this._dissolve.title = "Warning! This takes a long time!"
		L.DomEvent.addListener(this._dissolve, "click", L.DomEvent.stopPropagation);
		element.appendChild(this._dissolve);
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