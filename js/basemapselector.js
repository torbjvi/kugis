var MixIn = {
getTileUrlPreview: function (coords) {
		return L.Util.template(this._url, L.extend({
			r: this.options.detectRetina && L.Browser.retina && this.options.maxZoom > 0 ? '@2x' : '',
			s: this._getSubdomain(coords),
			x: coords.x,
			y: this.options.tms ? this._tileNumBounds.max.y - coords.y : coords.y,
			z: coords.z
		}, this.options));
	}
}; // Adds back the ability to get a tile at a zoom and coordlevel
L.TileLayer.include(MixIn);
var BasemapSelector = L.Class.extend({
	baseMaps: { // The default maps that can be selected from
			'Kartverket Norges grunnkart': L.tileLayer.kartverket("norges_grunnkart"),
			'Kartverket Norges grunnkart gråtone': L.tileLayer.kartverket("norges_grunnkart_graatone"),
			'OpenStreetMap Default': L.tileLayer.provider('OpenStreetMap.Mapnik'),
			'OpenStreetMap German Style': L.tileLayer.provider('OpenStreetMap.DE'),
			'OpenStreetMap Black and White': L.tileLayer.provider('OpenStreetMap.BlackAndWhite'),
			'Thunderforest OpenCycleMap': L.tileLayer.provider('Thunderforest.OpenCycleMap'),
			'Thunderforest Transport': L.tileLayer.provider('Thunderforest.Transport'),
			'Thunderforest Landscape': L.tileLayer.provider('Thunderforest.Landscape'),
			'MapQuest OSM': L.tileLayer.provider('MapQuestOpen.OSM'),
			'Stamen Toner': L.tileLayer.provider('Stamen.Toner'),
			
			'Esri WorldStreetMap': L.tileLayer.provider('Esri.WorldStreetMap'),
			'Esri WorldTopoMap': L.tileLayer.provider('Esri.WorldTopoMap'),
			'Esri WorldImagery': L.tileLayer.provider('Esri.WorldImagery'),
			'Esri WorldShadedRelief': L.tileLayer.provider('Esri.WorldShadedRelief'),
			'Nokia Normal Day': L.tileLayer.provider('Nokia.normalDay'),
			'Nokia Terrain': L.tileLayer.provider('Nokia.terrainDay'),
			
			'Kartverket topo2': L.tileLayer.kartverket("topo2"),
			'Kartverket topo2graatone': L.tileLayer.kartverket("topo2graatone"),
			'Kartverket europa': L.tileLayer.kartverket("europa"),
			'Kartverket toporaster2': L.tileLayer.kartverket("toporaster2"),
			'Kartverket sjohovedkart2': L.tileLayer.kartverket("sjo_hovedkart2"),
			
	},
	baseLayers: [],
	_map: null,
	_container: null,
	_isHidden: true,
	initialize: function (map, container) {
		
		this._map = map;
		this._container = L.DomUtil.create('div', 'basemap-selector');
		$(this._container).hide();
		for(layerName in this.baseMaps) {
			this.baseLayers.push(new Basemap(layerName, this.baseMaps[layerName], map));
		}
		if(container != null)
			this.addTo(container);
	},
	addPreviews: function () {
		for(i = 0; i<this.baseLayers.length; i++) {
			this.baseLayers[i].addTo(this._container);
		}
	},
	toggle: function() {
		if(this._isHidden)
			this.show();
		else
			this.hide();
	},
	show: function() {
		if(this._isHidden) {
			$(this._container).show().animate({width: "107px"}, 500);
			this._isHidden = false;
		}
	},
	hide: function () {
		if(!this._isHidden) {
			$(this._container).animate({width: "0px"}, 500).hide();
			this._isHidden = true;
		}
	},
	addHeader: function () {
		
	},
	_onAdd: function () {
		this.addPreviews();
	},
	addTo: function(el) {
		this._onAdd();
		el.appendChild(this._container);
	},
	getElement: function () {
		return this._container;
	}

});
var Basemap = L.Class.extend({
	
	initialize: function(name, layer, map) {
		this.name = name;
		this.layer = layer;
		this._map = map;
		var previewPoint = { // this is a point outside of oslo that gives a good preview of how layers will look.
		x: 4340,
		y: 2383,
		z: 13
		};

		this.preViewUrl = layer.getTileUrlPreview(previewPoint); // gets the tile for the point this is used as the icon
		this.createDomElement();
	},
	createDomElement: function () {
		var form = L.DomUtil.create("form", "basemap-preview-form");
		form.onsubmit = function () { return false };
		var link = L.DomUtil.create('button', 'basemap-preview');
		var img = L.DomUtil.create('img', 'basemap-preview-img');
		link.title = this.name;
		link.href = this.name;
		link.parent = this;
		L.DomEvent.addListener(link, "click", this.onClick, this);
		L.DomEvent.addListener(img, "click", this.onClick, this);
		img.src = this.preViewUrl;
		link.appendChild(img);
		form.appendChild(link)
		this._element = form;
		this._link = img;
	},
	onClick: function (e) {
		this._map.removeLayer(defaultLayer);
		defaultLayer = this.layer;
		defaultLayer.addTo(this._map);
		basemapselector .hide();
		$('.basemap-selected').removeClass('basemap-selected');
		$(this._link).addClass('basemap-selected');
		L.DomEvent.stop(e);
		return false;
	},
	getElement: function () {
		return this._element;
	},
	addTo: function (el) {
		el.appendChild(this._element);
	}

});
