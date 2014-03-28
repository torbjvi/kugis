var FeatureExtractor = L.Class.extend({
	initialize: function (layer) {
		this._layer = layer;
		for(key in layer._layers) {
			var firstLayer = layer._layers[key];
			break;
		}
		this.fields = [];
		if(firstLayer.feature != null && firstLayer.feature.properties != null) {
			for(key in firstLayer.feature.properties) {
				this.fields.push(key);
				this.uniques[key] = [];
			}
		}
		this.createElements();
		document.body.appendChild(this.element);
	},
	createElements: function () {
		this.element = L.DomUtil.create("div", "feature-extractor");
		var list = L.DomUtil.create("ul", "feature-extractor");
		this.element.appendChild(list);
		this.element.style.position = "fixed";
		var listHeader = L.DomUtil.create("li", "feature-extractor header");
		list.appendChild(listHeader);
		listHeader.appendChild(document.createTextNode("Extract features from "+this._layer.fileName));
		var li = L.DomUtil.create("li", "Feature-extractor");
		list.appendChild(li);
		this.ruleList = L.DomUtil.create("ul", "feature-extractor rulelist");
		li.appendChild(this.ruleList);
		var li2 = L.DomUtil.create("li", "feature-extractor");
		var addRule = L.DomUtil.create("button", "feature-extractor");
		addRule.innerHTML = "Add rule";
		var execute = L.DomUtil.create("button", "feature-extractor");
		execute.innerHTML = "Extract";
		var close = L.DomUtil.create("button", "feature-extractor");
		close.innerHTML = "Close";
		this.nameField = L.DomUtil.create("input", "field-extractor");
		this.nameField.value = "ex_"+this._layer.fileName;
		list.appendChild(li2);
		li2.appendChild(document.createTextNode("Name of new layer: "));

		li2.appendChild(this.nameField);
		li2.appendChild(execute);
		L.DomEvent.addListener(execute, "click", this.execute, this);
		L.DomEvent.addListener(addRule, "click", this.addRuleField, this);
		L.DomEvent.addListener(close, "click", this.close, this);
		li2.appendChild(addRule);
		li2.appendChild(close);
		
	},
	uniques: {

	},
	close: function () {
		$(this.element).remove();
		//this = {};
	},
	addRuleField: function () {
		var li = L.DomUtil.create("li", "feature-extractor rule");
		var trash = L.DomUtil.create("button", "feature-extractor");
		trash.appendChild(L.DomUtil.create("i", "icon-trash"));
		li.appendChild(trash);
		li.field = this.createFieldSelector();
		li.operation = this.createEqualSelector();
		li.appendChild(li.field);
		li.appendChild(li.operation);
		li.fieldValue = L.DomUtil.create("input", "field-extractor");
		li.appendChild(li.fieldValue);
		this.ruleList.appendChild(li);
		var button = L.DomUtil.create("button", "feature-extractor");
		button.appendChild(document.createTextNode("u"));
		li.appendChild(button);
		var li;
		var getUniqueValues = this.getUniqueValues;
		var layer = this._layer;
		button.onclick  = function (event) {
			var uniqueFields =  getUniqueValues(li.field.value, layer);
			$(li.fieldValue).replaceWith(uniqueFields);
			li.fieldValue = uniqueFields;
		}
		trash.onclick = function (event) {
			$(li).remove();
		}

	},
	createFieldSelector: function () {
		var select = L.DomUtil.create("select", "feature-extractor");
		for(var i = 0; i < this.fields.length; i++){
			var option = L.DomUtil.create("option", "feature-extractor");
			option.value = this.fields[i];
			option.appendChild(document.createTextNode(this.fields[i]));
			select.appendChild(option);
		}
		return select;	
	},
	createEqualSelector: function () {
		var select = L.DomUtil.create("select", "feature-extractor");
		var list = ["equals", "not equal to", "above", "below", "equal or above", "equal or below"];
		for(var i = 0; i < list.length; i++){
			var option = L.DomUtil.create("option", "feature-extractor");
			option.value = list[i];
			option.appendChild(document.createTextNode(list[i]));
			select.appendChild(option);
		}
		return select;	
	},
	getUniqueValues: function (fieldName, layer) {
		var uniqueValues = {}
		layer.eachLayer(function (l) {
			if(fieldName != "calculated area") {
				if(l.feature != null && l.feature.properties != null && l.feature.properties[fieldName]) {
					var value = l.feature.properties[fieldName];
					if(uniqueValues[value] == null)
						uniqueValues[value] = 1;
				}
				
			}
	
			
		});
		var select = L.DomUtil.create("select", "feature-extractor");
		for(var key in uniqueValues) {
			var option = L.DomUtil.create("option", "feature-extractor");
			option.value = key;
			option.appendChild(document.createTextNode(key));
			select.appendChild(option);
		}
		return select;
	},
	execute: function () {
		var featureGroup = this._layer;
		var ruleList = this.ruleList;
		var rules = [];
		var featureCollection = {
			type: "FeatureCollection",
			features: []
		};
		for(var i = 0; i<ruleList.childElementCount; i++) {
			rules.push({field: ruleList.childNodes[i].field.value, operation: ruleList.childNodes[i].operation.value, fieldValue: ruleList.childNodes[i].fieldValue.value});
		}
		var group = L.featureGroup();
		group.fileName = this.nameField.value;
		this._layer.eachLayer(function (l) {
			var result = true;
			for(var i = 0; i<rules.length; i++) {
				var field = rules[i].field;
				var operation = rules[i].operation;
				var fieldValue = rules[i].fieldValue;
				if(field != "calculated area") {
					if(l.feature != null && l.feature.properties != null && l.feature.properties[field] && result) {
						var comparing = l.feature.properties[field];
						switch (operation) {
							case "equals":
							result = (comparing == fieldValue);
							break;
							case "not equal to":
							result = (comparing != fieldValue);
							break;
							case "above":
							result = (comparing > fieldValue);
							break;
							case "below":
							result = (comparing < fieldValue);
							break;
							case "equal or above":
							result = (comparing >= fieldValue);
							break;
							case "equal or below":
							result = (comparing <= fieldValue);
							break;
							default:
							result = false;
							break;
						}
					}
					else {
						result = false;
					}

				}
				else {
					result = false;
				}
				
			}
			if(result) {
					featureGroup.removeLayer(l);
					l.setStyle({color: color});
					featureCollection.features.push(l.feature);

					
			}
		});
		layerlist.addLayer(this.nameField.value,featureCollection);

	}

});