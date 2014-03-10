Sidebar.Tool.Intersect = Sidebar.Tool.extend({
	title: "Intersection",
		layer1: null,
	layer2: null,
	_droppableText: "Drop two layers here in succession to create an intersection between them.",
	afterDrop: function (event, context) {
		
		
		layer = event.draggable[0].this._layer;
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
	execute: function (l1, l2) {

		var reader = new jsts.io.GeoJSONReader();
		var parser =  new jsts.io.GeoJSONParser();
		var gj1 = l1.toGeoJSON();
		var gj2 = l2.toGeoJSON();
		var length = (gj1.features.length*gj2.features.length);
		logger.newLog("Intersection...", length);
		var intersectionWorker = new Worker('workers/intersect.js');

		intersectionWorker.postMessage({gj1: gj1, gj2: gj2});
		
		intersectionWorker.onmessage = function (e) {
			if(e.data.msg) {
				logger.done();
				logger = new Logger();
				name = l1.fileName+"_"+l2.fileName;
				layerlist.addLayer(name, e.data.fc);
			}
			else
				logger.step();

		};

	},
	createToolOptions: function () {
		element = L.DomUtil.create("div", "tool-options");
		this._droppable = L.DomUtil.create('div', 'droppable');

		var con = this;
		$(this._droppable).droppable({
			drop: function (event, ui) {
				con.afterDrop(ui, con);
			}
		});
		this._droppable.appendChild(document.createTextNode(this._droppableText));
		element.appendChild(this._droppable);
		return element;
	}
		
});