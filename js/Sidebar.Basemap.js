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