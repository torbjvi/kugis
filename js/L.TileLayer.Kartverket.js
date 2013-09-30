L.TileLayer.Kartverket = L.TileLayer.extend({
	options: {
		attribution: 'Map data &copy; Kartverket'
	},
	initialize: function (layer, options) {
		     var bgUrl = 'http://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers='+layer+'&zoom={z}&x={x}&y={y}';
		     L.TileLayer.prototype.initialize.call(this, bgUrl, options);
	}
});
L.tileLayer.kartverket = function (layer, options) {
	return new L.TileLayer.Kartverket(layer, options);
};
