var Sidebar = L.Class.extend({
	initialize: function (map) {
		this._element = L.DomUtil.create('div', 'sidebar');
		this._map = map;
		var svg = '<embed src="grass_eating_cow.svg" type="image/svg+xml" class="logo" /><span class="title">-gis</span>';
		this._element.innerHTML = svg;
	},
	addTo: function (el) {
		el.appendChild(this._element);
	},
	map: null,
	getElement: function () {
		return this._element;
	} 
});
Sidebar.LayerList = L.Class.extend({
	initialize: function (map) {
		this._container = L.DomUtil.create('ul', '');
		this._header =  L.DomUtil.create('li', 'layerlist-header');
		this._header.appendChild(L.DomUtil.create('i', 'icon-reorder'));
		this._header.appendChild(document.createTextNode(" Layers"));
		this._listcontainer = L.DomUtil.create('li', 'layerlist-listcontainer');
		this._element = L.DomUtil.create('ul', 'layerlist');
		this._container.appendChild(this._header);
		this._container.appendChild(this._listcontainer);
		this._listcontainer.appendChild(this._element);
		
		this._map = map;
		this._element.this = this;
		$(this._element ).sortable();
    	$( this._element ).disableSelection();
    	$( this._element  ).on( "sortupdate", function( event, ui ) {
    		
    		event.currentTarget.this.sortLayers();
    	} );
	},
	sortLayers: function () {
		var target = this._element;
    		for(var i =0; i<target.childElementCount; i++) {
    			if(target.childNodes[i].this._map.hasLayer(target.childNodes[i].this._layer))
    				target.childNodes[i].this._layer.bringToBack();
    		}
	},

	addLayer: function (layer, color) {
		var bounds = layer.getBounds();
		this._map.fitBounds(bounds);

		var layerButton = new Sidebar.LayerList.Button(layer, this._map, color);
		if(this._element.childElementCount == 0)
			this._element.appendChild(layerButton.getElement());
		else
			this._element.insertBefore(layerButton.getElement(),this._element.childNodes[0]);

	},
	addTo: function(element) {
		element.getElement().appendChild(this._container);
	},
	getElement: function() {
		return this._container;
	},
	layers: [],
	map: null,

});
Sidebar.Basemap = L.Class.extend({
	initialize: function () {
		this._container = L.DomUtil.create('ul', '');
		this._header =  L.DomUtil.create('li', 'layerlist-layer ui-state-default layerbutton');
		this._header.title =  "Click me to choose a different basemap"
		this._header.appendChild(document.createTextNode("Choose basemap"));
		this._header.style.borderLeft="10px solid #e74c3c";
		this._header.style.cursor="pointer";
		this._container.appendChild(this._header);
		this._header.onclick = function () { basemapselector.toggle(); }
	},
	addTo: function(element) {
		element.getElement().appendChild(this._container);
	},
	getElement: function() {
		return this._container;
	}
});
Sidebar.Tools = L.Class.extend({
	initialize: function () {
		this._container = L.DomUtil.create('ul', '');
		this._header =  L.DomUtil.create('li', 'layerlist-header');
		this._header.appendChild(L.DomUtil.create('i', 'icon-legal'));
		this._header.appendChild(document.createTextNode(" Tools"));
		this._listcontainer = L.DomUtil.create('li', 'layerlist-listcontainer');
		this._element = L.DomUtil.create('ul', 'layerlist');
		this._container.appendChild(this._header);
		this._container.appendChild(this._listcontainer);
		this._listcontainer.appendChild(this._element);
	},
	addTool: function(tool) {
		this._element.appendChild(tool.getElement());
	},
	addTo: function(element) {
		element.getElement().appendChild(this._container);
	},
	getElement: function() {
		return this._container;
	}
});
Sidebar.LayerList.Button = L.Class.extend({
	_layer: null,
	_map: null,
	_element: null,
	initialize: function (layer, map, color) {
		
		this._layer = layer;
		this._map = map;
		layer.addTo(map);
		this._element = L.DomUtil.create("li", "layerlist-layer ui-state-default layerbutton");
		this._element.this = this;
		/*var sublist = L.DomUtil.create("ul", "layerlist-sublist");
		this._element.appendChild(sublist);
		var sublistItem = L.DomUtil.create("li", "layerlist-layer-name");
		var button = L.DomUtil.create("button", "layerbutton");
		button.appendChild(document.createTextNode("test"));
		sublistItem.appendChild(button);
		sublist.appendChild(sublistItem);
		var properties = L.DomUtil.create("li", "layerlist-layer-properties");
		*/
		this._element.style.borderLeft="10px solid "+color;
		this._element.appendChild(document.createTextNode(layer.fileName));

		this._checkIcon = L.DomUtil.create("i","icon-check-sign pull-right checkmark");

		L.DomEvent.addListener(this._checkIcon, "click", this.toggleLayer, this);
		this._element.appendChild(this._checkIcon);
		this._element.appendChild(L.DomUtil.create("i","icon-cogs pull-right checkmark"));
	},
	toggleLayer: function() {
		if(this._map.hasLayer(this._layer)) {
			this._map.removeLayer(this._layer);
			L.DomUtil.removeClass(this._checkIcon, "icon-check-sign");
			L.DomUtil.addClass(this._checkIcon, "icon-sign-blank");

		}
		else {
			this._map.addLayer(this._layer);
			this._element.parentNode.this.sortLayers();
			L.DomUtil.removeClass(this._checkIcon, "icon-sign-blank");
			L.DomUtil.addClass(this._checkIcon, "icon-check-sign");
		}

	},
	getElement: function() {
		return this._element;
	}
});
Sidebar.FileDropper = L.Class.extend({
	initialize: function (map) {
		this._container = L.DomUtil.create('div', 'droppable file-dropper');
		this._container.id = "file-dropper";
		var text = "Drop GeoJSON or zipped shp, prj and dbf files here to add them to the map."
		this._container.appendChild(document.createTextNode(text));
	},
	addTo: function (el) {
		el.getElement().appendChild(this._container);
	}
});
Sidebar.Tool = L.Class.extend({
	_map: null,
	_element: null,
	_multiInputs: false,
	_droppableText: "Not implemented",
	initialize: function (map, color) {
		this._map = map;
		this._element = L.DomUtil.create("li", "layerlist-layer ui-state-default layerbutton");
		this._element.style.borderLeft="10px solid "+color;
		this._element.style.cursor = "pointer";
		this._element.this = this;
		this._element.appendChild(document.createTextNode(this.title));
		L.DomEvent.addListener(this._element, "click", this.toggleOptions, this);
		this._option = this.createToolOptions();
		this._element.appendChild(this._option);

		$(this._option).hide();
	},
	toggleOptions: function () {
		$(this._option).toggle();
	},
	afterDrop: function (event) {
		alert("not implemented");
	},
	getElement: function() {
		return this._element;
	},
	createToolOptions: function() {
		return  L.DomUtil.create("div", "tool-options");
	}
});
Sidebar.Tool.Buffer = Sidebar.Tool.extend({
	title: "Buffer",
	_droppableText: "Drop a layer here to buffer!",
	afterDrop: function (event, context) {
		
		var message = "test";
		bufferWorker = new Worker('workers.js');
		dissolveWorker = new Worker('dissolve.js');
		
		dissolve = this._dissolve.checked;
		console.log("Drop");
		var pointLayer = false;
		var distance = context._distance.value;
		layer = event.toElement.this._layer;
		 bufferWorker.onmessage = function(evt) {
		 	var queue = evt.data.queue;
		 	logger.step();
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
		for(var i = 0;i<wkts.length;i++) {
			wkts[i].components = WktUtils.transformWktComponentsToWebMercator(wkts[i].components);
			wkts[i] = wkts[i].write();
		}
		logger.newLog("Buffer", wkts.length, 0);
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
				con.afterDrop(event, con);
			}
		});
		this._droppable.appendChild(document.createTextNode(this._droppableText));
		element.appendChild(this._droppable);
		return element;
		
	}
});
Sidebar.Tool.BufferRings = Sidebar.Tool.extend({

	title: "BufferRings",
	_droppableText: "Drop a layer here create buffer rings!",
	afterDrop: function (event, context) {
		console.log("Drop");
		var pointLayer = false;
		var distance = context._distance.value;
		layer = event.toElement.this._layer;
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
				con.afterDrop(event, con);
			}
		});
		this._droppable.appendChild(document.createTextNode(this._droppableText));
		element.appendChild(this._droppable);
		return element;
		
	}
});
Sidebar.Tool.Intersect = Sidebar.Tool.extend({
	title: "Intersect"
});
Sidebar.Tool.Difference = Sidebar.Tool.extend({
	title: "Difference",
		wkt1: null,
	wkt2: null,
	_droppableText: "Drop two layers here in succession to \"differ\" them",
	afterDrop: function (event, context) {
		logger.newLog("Difference...");
		layer = event.toElement.this._layer;
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
			var wkts = WktUtils.difference(this.wkt1,this.wkt2);
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
				con.afterDrop(event, con);
			}
		});
		this._droppable.appendChild(document.createTextNode(this._droppableText));
		element.appendChild(this._droppable);
		return element;
	}
		
});
Sidebar.Tool.Simplify = Sidebar.Tool.extend({
	title: "Simplify",
	afterDrop: function (event, context) {
		layer = event.toElement.this._layer;
		var origSum = 0;
		var newSum = 0;
		var wkts = WktUtils.layerToWkt(layer);
		var color = colors.next();
				
		var style = {
		          opacity:1,
		          fillOpacity:0.7,
		          radius:6,
		          color: color
			};
		var group = L.featureGroup(); 
		for(var i = 0; i<wkts.length; i++) {
			wkts[i].components = WktUtils.transformWktComponentsToWebMercator(wkts[i].components);
			var origSum = origSum+wkts[i].components.length;
			wkts[i].components = L.LineUtil.simplify(wkts[i].components, this._distance.value);
			var newSum = newSum+wkts[i].components.length;
			wkts[i].components = WktUtils.transformWktToWGS84(wkts[i].components);
			var d = wkts[i].toObject();
			d.setStyle(style);
			group.addLayer(d);
		}
		group.fileName = layer.fileName+"_s";
		layerlist.addLayer(group,color);
		console.log(origSum);
		console.log(newSum);


	},
	createToolOptions: function () {
		element = L.DomUtil.create("div", "tool-options");
		element = L.DomUtil.create("div", "tool-options");
		element.appendChild(document.createTextNode("Tolerance: "));
		this._distance = L.DomUtil.create("input", "buffer-distance");
		this._distance.value = 100;
		L.DomEvent.addListener(this._distance, "click", L.DomEvent.stopPropagation);
		element.appendChild(this._distance);
		element.appendChild(document.createTextNode(" m"));

		this._droppable = L.DomUtil.create('div', 'droppable');

		var con = this;
		$(this._droppable).droppable({
			drop: function (event, ui) {
				con.afterDrop(event, con);
			}
		});
		this._droppable.appendChild(document.createTextNode(this._droppableText));
		element.appendChild(this._droppable);
		return element;
	}
});
Sidebar.Tool.Overlay = Sidebar.Tool.extend({
	title: "Intersection",
	wkt1: null,
	wkt2: null,
	_droppableText: "Drop two layers here in succession to intersect them",
	afterDrop: function (event, context) {
		layer = event.toElement.this._layer;
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
			group.fileName = "Difference";
			layerlist.addLayer(group, color);
			this.wkt1 = null;
			this.wkt2 = null;
		}

	},
	createToolOptions: function () {
		element = L.DomUtil.create("div", "tool-options");
		this._droppable = L.DomUtil.create('div', 'droppable');

		var con = this;
		$(this._droppable).droppable({
			drop: function (event, ui) {
				con.afterDrop(event, con);
			}
		});
		this._droppable.appendChild(document.createTextNode(this._droppableText));
		element.appendChild(this._droppable);
		return element;
		
	}
});
Sidebar.Tool.Distance = Sidebar.Tool.extend({
	title: "Distance"
});
Sidebar.Tool.Centroid = Sidebar.Tool.extend({
	title: "Centroid"
});
Sidebar.Tool.Union = Sidebar.Tool.extend({
	title: "Union"
});