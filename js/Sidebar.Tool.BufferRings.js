Sidebar.Tool.BufferRings = Sidebar.Tool.extend({

	title: "BufferRings",
	_droppableText: "Drop a layer here create buffer rings!",
	afterDrop: function (event, context) {
		this.toggleOptions();
		console.log("Drop");
		var pointLayer = false;
		var distance = context._distance.value;
		layer = event.draggable[0].this._layer;
		var filename = layer.fileName;
		var layers = [];
		for(var i = 0; i<context._rings.value; i++) {
			for(key in layer._layers) {
						if(layer._layers[key].feature != null &&layer._layers[key].feature.geometry.type == "Point")
							pointLayer = true;
						break;
			}
			
			if(pointLayer)
				var ccc = WktUtils.pointLayerToWkt(layer);
			else
				var ccc= WktUtils.layerToWkt(layer);

			console.log("WKT generated");
				comp = WktUtils.transformWktComponentsToWebMercator(ccc.components);
				console.log("WKT reprojected");
				ccc.components = comp;
				console.log("Started buffering");
				buffer = WktUtils.buffer(ccc.write(), distance);
				console.log("Buffering done");

				var asd = new Wkt.Wkt(buffer);
				console.log("Reprojecting buffer")
				asd.components = WktUtils.transformWktToWGS84(asd.components);
				console.log("Buffer reprojected");
				var d = asd.toObject();
				console.log(d);
				var color = colors.next();
				
				d.setStyle({
				          opacity:1,
				          fillOpacity:0.7,
				          radius:6,
				          color: color
	    			});
				var group = L.featureGroup().addLayer(d);
				group.fileName = filename+'_buffer'+(i+1)*context._distance.value;
				layers.push({layer: group, color: color});
				layer = group;
				pointLayer = false;
		}
		for(var i = layers.length-1; i > -1; i--) {
			layerlist.addLayer(layers[i].layer, layers[i].color);
		}
		

	},
	createToolOptions: function () {
		element = L.DomUtil.create("div", "tool-options");
		element.appendChild(document.createTextNode("Distance: "));
		this._distance = L.DomUtil.create("input", "buffer-distance");
		this._distance.value = 25;
		L.DomEvent.addListener(this._distance, "click", L.DomEvent.stopPropagation);
		element.appendChild(this._distance);
		element.appendChild(document.createTextNode(" m"));
		element.appendChild(document.createTextNode("No. of rings: "));
		this._rings = L.DomUtil.create("input", "buffer-distance");
		this._rings.value = 5;
		L.DomEvent.addListener(this._rings, "click", L.DomEvent.stopPropagation);
		element.appendChild(this._rings);
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