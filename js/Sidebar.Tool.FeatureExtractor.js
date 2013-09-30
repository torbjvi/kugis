Sidebar.Tool.FeatureExtractor = Sidebar.Tool.extend({
	title: "FeatureExtractor",
	_droppableText: "Drop a layer here to start extracting features",
	createToolOptions: function () {
		element = L.DomUtil.create("div", "tool-options");
		this._droppable = L.DomUtil.create('div', 'droppable');

		var con = this;
		$(this._droppable).droppable({
			drop: function (event, ui) {
				Sidebar.Tool.FeatureExtractor.prototype.afterDrop.call(con, ui);
			}
		});
		this._droppable.appendChild(document.createTextNode(this._droppableText));
		element.appendChild(this._droppable);
		return element;
		
	},
	afterDrop: function (event, context) {
		this.toggleOptions();
		var layer = event.draggable[0].this._layer;
		new FeatureExtractor(layer);

	},
});