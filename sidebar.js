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
	layerToWkt: function (layer) {
		if(layer.fileName != "Points") {
		console.log(layer);
		var wkts = [];
		layer.eachLayer(function (l) {
			        var wkt = new Wkt.Wkt();

// Deconstruct an existing point (or "marker") feature
		wkt.fromObject(l);
		wkts.push(wkt);
// "[ {x: 10, y: 30} ]"
		});
		var w = wkts[0];
		for(var i = 1; i<wkts.length; i++) {
			w.merge(wkts[i]);
		}
		console.log(w.write());
	}
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
 	var reader = new jsts.io.GeoJSONReader();

    var input = reader.read(this._layer.toGeoJSON());

    var buffer = input.buffer(20);

	},
	getElement: function() {
		return this._element;
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
		console.log("Drop");
		var pointLayer = false;
		var distance = context._distance.value;
		layer = event.toElement.this._layer;
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
			group.fileName = layer.fileName+'_buffer';
			layerlist.addLayer(group,color);

		

	},
	createToolOptions: function () {
		element = L.DomUtil.create("div", "tool-options");
		element.appendChild(document.createTextNode("Distance: "));
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
Sidebar.Tool.Intersect = Sidebar.Tool.extend({
	title: "Intersect"
});
Sidebar.Tool.Difference = Sidebar.Tool.extend({
	title: "Difference"
});
Sidebar.Tool.Simplify = Sidebar.Tool.extend({
	title: "Simplify"
});
Sidebar.Tool.Overlay = Sidebar.Tool.extend({
	title: "Overlay",
	wkt1: null,
	wkt2: null,
	_droppableText: "Not implemented",
	afterDrop: function (event, context) {
		layer = event.toElement.this._layer;
		if(this.wkt1 == null) {
			this.wkt1 = WktUtils.layerToWkt(layer);
			comp = WktUtils.transformWktComponentsToWebMercator(this.wkt1.components);
			this.wkt1.components = comp;
		}
		else {
			console.log("Drop");
			var distance = context._distance.value;
			
			if(layer.fileName != "Points") {
				this.wkt2 = WktUtils.layerToWkt(layer);
				console.log("WKT generated");
				comp = WktUtils.transformWktComponentsToWebMercator(this.wkt2.components);
				console.log("WKT reprojected");
				this.wkt2.components = comp;
				console.log("Started buffering");
				overlay = WktUtils.overlay(this.wkt1.write(), this.wkt2.write());
				console.log("Buffering done");
				var asd = new Wkt.Wkt(overlay);
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
				group.fileName = layer.fileName+'_buffer';
				layerlist.addLayer(group,color);
			}
			this.wkt1 = null;
			this.wkt2 = null;

		}
	},
	createToolOptions: function () {
		element = L.DomUtil.create("div", "tool-options");
		this._distance = L.DomUtil.create("input", "buffer-distance");
		this._distance.value = 100;
		L.DomEvent.addListener(this._distance, "click", L.DomEvent.stopPropagation);
		element.appendChild(this._distance);
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