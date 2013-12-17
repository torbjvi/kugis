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