// Class for diplaying layers in the layerlist
Sidebar.LayerList.Button = L.Class.extend({
	_layer: null,
	_map: null,
	_element: null,
	_dbId: null,
	initialize: function (layer, map, color) {
		var context = this;
		window.dbserver.layers.add( { // adds the layer to the IndexedDB, this is done here because the button needs to know the database key to remove it from the table when deleting the layer.
			    name: layer.fileName,
			    geojson: layer.toGeoJSON(),
			} ).done( function ( item ) {
			    context._dbId = item[0].id;
			} );
		this._color = color;
		this._layer = layer;
		this._strokeOpacity = 1.0;
		this._fillOpacity = 0.7;
		this._fillColor = color;
		this._map = map;
		layer.addTo(map);
		this._element = L.DomUtil.create("li", "layerlist-layer ui-state-default layerbutton");
		this._element.this = this;
		for(key in layer._layers) {
			var l = layer._layers[key];
			this.type = l.toGeoJSON().geometry.type;
			break;
		}
		this._element.title = layer.fileName;
		this._icon = this.getIcon(color);
		this._element.appendChild(this._icon);
		var layerTrunc = layer.fileName.substr(0,18);
		this._textElement = L.DomUtil.create("span", "layer-title");
		this._textElement.appendChild(document.createTextNode(" "+layerTrunc));
		this._element.appendChild(this._textElement);

		this._checkIcon = L.DomUtil.create("i","icon-check-sign pull-right checkmark");
		this._trash = L.DomUtil.create("i","icon-trash pull-right checkmark");
		L.DomEvent.addListener(this._checkIcon, "click", this.toggleLayer, this);
		//this._save = L.DomUtil.create("i","icon-save pull-right checkmark"); // Save functionality is disabled since it's not working reliably
		//L.DomEvent.addListener(this._save, "click", this.save, this);
		L.DomEvent.addListener(this._trash, "click", this.remove, this);
		this._element.appendChild(this._checkIcon);
		var prefIcon = L.DomUtil.create("i","icon-cogs pull-right checkmark");
		this._element.appendChild(prefIcon);
		L.DomEvent.addListener(prefIcon, "click", function (e) {
			$(this._prefEl).toggle();
		}, this);
		this._element.appendChild(this._trash);
		//this._element.appendChild(this._save);
		this._prefEl = this.optionsElements();
		this._element.appendChild(this._prefEl);

	},
	save: function () {
  		window.prompt ("To save a layer, copy this text to a new textfile ending in .geojson: Ctrl+C, Enter", JSON.stringify(this._layer.toGeoJSON()));
	},
	updateStyle: function () {
		var style = {
			color: this._color,
			opacity: this._strokeOpacity,
			fillOpacity: this._fillOpacity,
			fillColor: this._fillColor
		}
		this._icon.style.color = this._color;
		this._layer.setStyle(style);
	},
	updateLayerName: function(name) {
		var layerTrunc = name.substr(0,18);
		this._textElement.innerHTML = " "+layerTrunc;

	},
	updateFillColor: function (c,color) {
		c._fillColor = color;
		c.updateStyle();
	},
	updateStrokeColor: function (c,color) {
		c._color = color;
		c.updateStyle();
	},
	colorSelector: function (callback) {
		var li = L.DomUtil.create("li");
		var iconClass = "icon-sign-blank color-select-icon";
		for(var i = 0; i<colors.colors.length;i++) {
			var colorSelect = L.DomUtil.create("i", iconClass);
			colorSelect.style.color = colors.colors[i];
			colorSelect.fillColor = colors.colors[i];
			L.DomEvent.addListener(colorSelect, "click", function (e) { 
			callback(this, e.target.fillColor);
		 }, this);
			li.appendChild(colorSelect); 
		}
		return li;
	},
	optionsElements: function () {
		var ul = L.DomUtil.create("ul", "layeroptions");
		var name = L.DomUtil.create("li", "layeroptions");
		var stroke = L.DomUtil.create("li", "layeroptions");
		var fill = L.DomUtil.create("li", "layeroptions");
		name.appendChild(document.createTextNode("Name: "));
		var nameInput = L.DomUtil.create("input");
		nameInput.value = this._layer.fileName;
		L.DomEvent.addListener(nameInput, "keyup", function (e) { 
			this._layer.fileName = e.target.value;
			this.updateLayerName(e.target.value);
		 }, this);
		nameInput.style.width = "120px";
		name.appendChild(nameInput);
		ul.appendChild(name);
		stroke.appendChild(document.createTextNode("Stroke"));
		fill.appendChild(document.createTextNode("Fill"));
		ul.appendChild(stroke);
		var li = L.DomUtil.create("li", "layeroptions");
		li.appendChild(document.createTextNode("Opacity: "));
		var strokeInput = L.DomUtil.create("input");
		L.DomEvent.addListener(strokeInput, "keyup", function (e) { 
			this._strokeOpacity = e.target.value;
			this.updateStyle();
		 }, this);
		strokeInput.value = this._strokeOpacity;
		li.appendChild(strokeInput);
		
		ul.appendChild(li);
		ul.appendChild(this.colorSelector(this.updateStrokeColor));
		ul.appendChild(fill);
		var li = L.DomUtil.create("li", "layeroptions");
		li.appendChild(document.createTextNode("Opacity: "));
		var fillInput = L.DomUtil.create("input");
		L.DomEvent.addListener(fillInput, "keyup", function (e) { 
			this._fillOpacity = e.target.value;
			this.updateStyle();
		 }, this);
		fillInput.value = this._fillOpacity;
		li.appendChild(fillInput);
		ul.appendChild(li);
		ul.appendChild(this.colorSelector(this.updateFillColor));
		
		$(ul).hide();
		return ul;
	},
	getIcon: function (color) {
		var type;
		var iconClass = "icon-circle";
		switch (this.type) {
			case "LineString":
			iconClass = "icon-minus";
			break;
			case "MultiString":
			iconClass = "icon-minus";
			break;
			case "Polygon":
			iconClass = "icon-sign-blank"
			break;
			case "MultiPolygon":
			iconClass = "icon-sign-blank"
			break;


		}
		var icon = L.DomUtil.create("i", iconClass);
		icon.style.color = color;
		return icon;
	},
	remove: function() {

		this._map.removeLayer(this._layer);
		window.dbserver.layers.remove( this._dbId );
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