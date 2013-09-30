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
