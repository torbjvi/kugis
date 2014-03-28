Sidebar.Tool.Difference2 = Sidebar.Tool.extend({
	title: "Difference",
		layer1: null,
	layer2: null,
	_droppableText: "Drop a layer here, then drop the layer you want to subtract from it",
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

		
		var g1 = l1.toGeoJSON();
		var g2 = l2.toGeoJSON();
		this.g2 = g2;
		var context = this;
		context.doDifference = function(gj1, gj2) {
					var length = (gj1.features.length);
					logger.newLog("difference...", gj1.features.length);
					var differenceWorker = new Worker('workers/difference.js');

					differenceWorker.postMessage({gj1: gj1, gj2: gj2});
					
					differenceWorker.onmessage = function (e) {
						if(e.data.msg) {
							logger.done();
							logger = new Logger();
							name = l1.fileName+"-"+l2.fileName;
							layerlist.addLayer(name, e.data.fc, "black");
						}
						else {
							logger.step();
						}

					};
		};
		context.callback2 = function(gj2) {
			context.gj2 = gj2;
				context.doDifference(context.gj1, context.gj2);
		}
		var callback1 = function (gj1) {
			context.gj1 = gj1;
			if(!context.g2.features[0].properties["kugisCreated"])
				Sidebar.Tool.Dissolve.prototype.execute(context.g2, context.callback2);
			else
				context.callback2(context.g2);
		}
		if(!g1.features[0].properties["kugisCreated"])
			Sidebar.Tool.Buffer2.prototype.execute(g1, 0.00001, false, callback1);
		else
			callback1(g1);
		


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