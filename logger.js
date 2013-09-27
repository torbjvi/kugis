var Logger = L.Class.extend({
	initialize: function () {
		/*
		
		 <div class="logger">
  <ul class="logger-list">
    <li class="logger-header logger-list">Buffer</li>
    <li class="logger-messages logger-list">two<br>two<br>two<br>two<br>two<br>two<br>two<br>two<br>two<br>two<br>two<br>two<br>two<br>two<br>two<br>two<br>two<br>two<br></li>
    <li class="logger-progressbar logger-list">Buffering: 1/2313<div id="progressbar"></div></li>
  </ul>
</div>
<script>
  $(function() {
    $( "#progressbar" ).progressbar({
      value: false
    });
  });
  </script>*/
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
	newLog: function (title) {
		this.titleField.innerHTML = title;
		$(this.progressbar).progressbar({
      		value: false
  		 });
		$(this.element).show();
	},
	done: function () {
		$(this.element).hide();
	}
})