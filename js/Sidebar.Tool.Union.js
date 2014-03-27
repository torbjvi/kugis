Sidebar.Tool.Union = Sidebar.Tool.extend({
	title: "Union",
	layer1: null,
	layer2: null,
	_droppableText: "Drop two layers here in succession to create a union!",
	afterDrop: function (event, context) {

		var message = "test";
		dissolveWorker = new Worker('workers/dissolve.js');
		if(this.layer1 == null)
			this.layer1 = event.draggable[0].this._layer;
		else
			this.layer2 = event.draggable[0].this._layer;
		if(this.layer1 !== null && this.layer2 !== null) {
			this.toggleOptions();
			this.execute(this.layer1, this.layer2);
		 	this.layer1 = this.layer2 = null;
		 }

	},
	execute: function (layer1, layer2) {
		var geojson1 = layer1.toGeoJSON();
		var geojson2 = layer2.toGeoJSON();
		var features = geojson1.features.concat(geojson2.features);
		geojson1.features = features;
		Sidebar.Tool.Dissolve.prototype.execute(geojson1);
	},

	createToolOptions: function () {
		element = L.DomUtil.create("div", "tool-options");
		this._droppable = L.DomUtil.create('div', 'droppable');

		var con = this;
		$(this._element).droppable({
			drop: function (event, ui) {
				con.afterDrop(ui, con);
			}
		});
		this._droppable.appendChild(document.createTextNode(this._droppableText));
		element.appendChild(this._droppable);
		return element;
		
	}
});