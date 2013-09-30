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