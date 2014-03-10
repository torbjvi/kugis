// Layerlist that handles the ordering and adding of layers.
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

	addLayer: function (name, geojson) {
		if(geojson.features.length>0) {
			var layerButton = new Sidebar.LayerList.Button(name, geojson, this._map);
			if(this._element.childElementCount == 0)
				this._element.appendChild(layerButton.getElement());
			else
				this._element.insertBefore(layerButton.getElement(),this._element.childNodes[0]);
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