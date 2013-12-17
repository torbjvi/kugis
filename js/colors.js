// class containing colors used by the layers and functionality for stepping through them
var Colors = L.Class.extend({
	colors: [
	"#1abc9c",
	"#f39c12",
	"#2980b9",
	"#2ecc71",
	"#3498db",
	"#9b59b6",
	"#16a085",
	"#27ae60",
	
	"#8e44ad",
	"#2c3e50",
	"#f1c40f",
	"#e67e22",
	"#e74c3c",
	"#ecf0f1",
	"#95a5a6",
	
	"#d35400",
	"#c0392b",
	"#bdc3c7",
	"#7f8c8d"
	],
	currentColor: 0,
	initialize: function () {
		currentColor = 0;
	},
	next: function () {
		var c = this.colors[this.currentColor];
		this.currentColor++;
		if(this.currentColor == this.colors.length)
			this.currentColor = 0;
		return c;
	}
});