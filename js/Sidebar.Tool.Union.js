Sidebar.Tool.Union = Sidebar.Tool.extend({
	title: "Union",
	layer1: null,
	layer2: null,
	_droppableText: "Drop two layers here in succession to create a union!",
	afterDrop: function (event, context) {

		var message = "test";
		dissolveWorker = new Worker('workers/dissolve.js');
		if(this.layer1 == null)
			this.layer1 = event.draggable[0].this._layer;
		else
			this.layer2 = event.draggable[0].this._layer;
		if(this.layer1 !== null && this.layer2 !== null) {
			this.toggleOptions();
			this.execute(this.layer1, this.layer2);
		 	this.layer1 = this.layer2 = null;
		 }

	},
	execute: function (layer1, layer2) {
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
							
							group.fileName = "Union";
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

		for(key in layer1._layers) {
					if(layer1._layers[key].feature != null &&layer1._layers[key].feature.geometry.type == "Point")
						pointLayer = true;
					break;
		}
		var wkts;
		if(!pointLayer) {
			wkts = WktUtils.layerToWkt(layer1);
		}
		else {
			wkts = WktUtils.pointLayerToWkt(layer1);
		}
		for(key in layer2._layers) {
					if(layer2._layers[key].feature != null &&layer2._layers[key].feature.geometry.type == "Point")
						pointLayer = true;
					break;
		}
		var wkts2;
		if(!pointLayer) {
			wkts2 = WktUtils.layerToWkt(layer2);
		}
		else {
			wkts2 = WktUtils.pointLayerToWkt(layer2);
		}
		wkts = wkts.concat(wkts2);


			logger.newLog("Unionizing", wkts.length, 0);
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