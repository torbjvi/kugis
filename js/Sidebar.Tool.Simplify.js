Sidebar.Tool.Simplify = Sidebar.Tool.extend({
	title: "Simplify",
	_droppableText: "Drop a layer here to generalize it.",
	afterDrop: function (event, context) {
		this.toggleOptions();
		layer = event.draggable[0].this._layer;
		var tolereance = this._distance.value;
		var group = L.featureGroup();
			var color = colors.next();
			var style = {
		          opacity:1,
		          fillOpacity:0.7,
		          radius:6,
		          color: color
			};
			group.fileName = layer.fileName+"_s";
		layer.eachLayer(function (l) {
			var latlngs = l.getLatLngs();
			var coords = [];
			for(var i=0;i<latlngs.length;i++) {
				coords.push({y: latlngs[i].lat, x: latlngs[i].lng});
			}

			var coords = L.LineUtil.simplify(coords,tolereance);
			for(var i = 0;i<coords.length;i++) {
				coords[i] = new L.LatLng(coords[i].y, coords[i].x);
			}
			var type = l.feature.geometry.type;
			switch (type) {
				case "Polygon":
					var d = L.polygon(coords);
					break;
				case "LineString":
					var d = L.polyline(coords);
			}


			d.setStyle(style);
			group.addLayer(d);


		});
		layerlist.addLayer(group, color);

	},
	createToolOptions: function () {
		element = L.DomUtil.create("div", "tool-options");
		element = L.DomUtil.create("div", "tool-options");
		element.appendChild(document.createTextNode("Tolerance: "));
		this._distance = L.DomUtil.create("input", "buffer-distance");
		this._distance.value = 0.001;
		L.DomEvent.addListener(this._distance, "click", L.DomEvent.stopPropagation);
		element.appendChild(this._distance);
		element.appendChild(document.createTextNode(" deg"));

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