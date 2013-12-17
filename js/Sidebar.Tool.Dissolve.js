Sidebar.Tool.Dissolve = Sidebar.Tool.extend({
	title: "Dissolve",
	_droppableText: "Drop a layer here to Dissolve it!",
	afterDrop: function (event, context) {
		this.toggleOptions();
		var message = "test";
		dissolveWorker = new Worker('workers/dissolve.js');
		layer = event.draggable[0].this._layer;
		 this.execute(layer);

	},
	execute: function (layer) {
		var pointLayer = false;
		dissolveWorker.onmessage = function(evt) {

		 	var queue = evt.data.queue;
		 	logger.step();
		 	if(queue != 0) {
		 		dissolveWorker.postMessage(evt.data);
		 	}
		 	if(queue == 0) {
		 		wktsb = [evt.data.polygon];
					 	
					 		var color = colors.next();
							var group = L.featureGroup();
							
							group.fileName = layer.fileName+"_dissolved";
					 		for(var i = 0; i<wktsb.length;i++) {
					 			wktsb[i] = new Wkt.Wkt(wktsb[i]);
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
							logger = new Logger();

				
					 	
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

			logger.newLog("Dissolving", wkts.length, 0);
		for(var i = 0;i<wkts.length;i++) {
			
			wkts[i] = wkts[i].write();
		}
		
		dissolveWorker.postMessage({polygon:null, queue: wkts});
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