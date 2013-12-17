var Logger = L.Class.extend({
	initialize: function () {
	  	var element = L.DomUtil.create("div", "logger");
	  	var list = L.DomUtil.create("ul", "logger-list");
	  	this.titleField = L.DomUtil.create("li", "logger-header logger-list");
	  	var progressLi = L.DomUtil.create("li", "logger-progressbar logger-list");
	  	this.progressbar = L.DomUtil.create("div", "");
	  	this.progressbar.id="progressbar";
	  	element.appendChild(list);
	  	list.appendChild(this.titleField);
	  	list.appendChild(progressLi);
  		progressLi.appendChild(this.progressbar);
  		$(element).hide();
  		document.body.appendChild(element);
  		$(this.progressbar).progressbar({
      		value: 0
  		 });
  		this.element = element;

	},
	i:0,
	newLog: function (title, sum, value) {
		if(value == null)
			value = false;
		else {
			value = 0;
		}
		this.sum = sum;
		$(this.element).show();
		this.titleField.innerHTML = title;
		$(this.progressbar).progressbar({
      		value: 0
  		 });
		
	},
	step: function() {
		this.i++;
		var perc = ((this.i/this.sum)*100);
		$(this.progressbar).progressbar("value", perc);
	},
	done: function () {
		$(this.element).hide();
	}
})