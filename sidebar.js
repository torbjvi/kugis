var Sidebar = L.Class.extend({
	initialize: function (map) {
		this._element = L.DomUtil.create('div', 'sidebar');
		this._map = map;
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
		this._header.appendChild(document.createTextNode("Layers"));
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
		this._header.appendChild(document.createTextNode("Basemap"));
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
		this._header.appendChild(document.createTextNode("Tools"));
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
		console.log("r");
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

Sidebar.Tool = L.Class.extend({
	_map: null,
	_element: null,
	_multiInputs: false,
	initialize: function (map, color) {
		this._map = map;
		this._element = L.DomUtil.create("li", "layerlist-layer ui-state-default layerbutton");
		this._element.style.borderLeft="10px solid "+color;
		this._element.this = this;
		this._element.appendChild(document.createTextNode(this.title));
		
	},
	getElement: function() {
		return this._element;
	}
});
Sidebar.Tool.Buffer = Sidebar.Tool.extend({
	title: "Buffer"
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
	title: "Overlay"
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