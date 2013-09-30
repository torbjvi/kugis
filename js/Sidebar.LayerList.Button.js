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
		for(key in layer._layers) {
			var l = layer._layers[key];
			this.type = l.toGeoJSON().geometry.type;
			break;
		}
		/*var sublist = L.DomUtil.create("ul", "layerlist-sublist");
		this._element.appendChild(sublist);
		var sublistItem = L.DomUtil.create("li", "layerlist-layer-name");
		var button = L.DomUtil.create("button", "layerbutton");
		button.appendChild(document.createTextNode("test"));
		sublistItem.appendChild(button);
		sublist.appendChild(sublistItem);
		var properties = L.DomUtil.create("li", "layerlist-layer-properties");
		*/
		this._element.title = layer.fileName;
		this._element.appendChild(this.getIcon(color));
		var layerTrunc = layer.fileName.substr(0,6);
		this._element.appendChild(document.createTextNode(" "+layerTrunc));

		this._checkIcon = L.DomUtil.create("i","icon-check-sign pull-right checkmark");
		this._trash = L.DomUtil.create("i","icon-trash pull-right checkmark");
		L.DomEvent.addListener(this._checkIcon, "click", this.toggleLayer, this);
		L.DomEvent.addListener(this._trash, "click", this.remove, this);
		this._element.appendChild(this._checkIcon);
		this._element.appendChild(L.DomUtil.create("i","icon-cogs pull-right checkmark"));
		this._element.appendChild(this._trash);
	},
	getIcon: function (color) {
		var type;
		console.log(this._layer);
		console.log(this.type);
		var iconClass = "icon-circle";
		switch (this.type) {
			case "LineString":
			iconClass = "icon-minus";
			break;
			case "Polygon":
			iconClass = "icon-sign-blank"
			break;

		}
		var icon = L.DomUtil.create("i", iconClass);
		icon.style.color = color;
		return icon;
	},
	remove: function() {
		this._map.removeLayer(this._layer);
		$(this._element).remove();
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