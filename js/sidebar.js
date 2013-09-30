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