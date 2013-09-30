var NewButton= L.Control.extend({//creating the buttons
    options: {
        position: 'topleft'
    },
    onAdd: function (map) {
      this._map = map;
        // create the control container with a particular class name
        var div = L.DomUtil.create('form','bgroup');
        div.id="dropzone";
        
   function handleFile(file){
    var addIt = function(geoJson){
       color = colors.next();
       var layer =L.geoJson(geoJson,options);
      layer.fileName = geoJson.fileName;
       layerlist.addLayer(layer, color);
    }
        var reader = new FileReader();
        reader.onload=function(){
            if(reader.readyState !== 2 || reader.error){
              return;
            }else{
              worker.data(reader.result,[reader.result]).then(function(geoJson){
                if(Array.isArray(geoJson)){
                 
                  geoJson.forEach(addIt)
                }else{
                  addIt(geoJson);
                }
              },function(a){console.log(a)});
           }
       };
           reader.readAsArrayBuffer(file);
   }
    function handleGeosjon(file){
    var addIt = function(geoJson){
       color = colors.next();
       var layer =L.geoJson(geoJson,options);
      layer.fileName = geoJson.fileName;
       layerlist.addLayer(layer, color);
    }
        var reader = new FileReader();
        reader.onload=function(){
            if(reader.readyState !== 2 || reader.error){
              return;
            }else{
              var geojson = JSON.parse(reader.result);
              geojson.fileName = file.name.toLowerCase().replace(".geojson", "");
                  addIt(geojson);
              
           }
       };
           reader.readAsText(file);
   }

 
var dropbox = document.getElementById("file-dropper");
dropbox.addEventListener("dragenter", dragenter, false);
dropbox.addEventListener("dragover", dragover, false);
dropbox.addEventListener("drop", drop, false);
dropbox.addEventListener("dragleave",function(){map.scrollWheelZoom.enable();},false);
var mapDiv = document.getElementById("map");
mapDiv.addEventListener("dragenter", dragenter, false);
mapDiv.addEventListener("dragover", dragover, false);
mapDiv.addEventListener("drop", drop, false);
mapDiv.addEventListener("dragleave",function(){map.scrollWheelZoom.enable();},false);
function dragenter(e) {
  e.stopPropagation();
  e.preventDefault();
 map.scrollWheelZoom.disable();
}
 
function dragover(e) {
  e.stopPropagation();
  e.preventDefault();
} 

function drop(e) {
  e.stopPropagation();
  e.preventDefault();
 map.scrollWheelZoom.enable();
  var dt = e.dataTransfer;
  var files = dt.files;
 
 var i = 0;
 var len = files.length;
 console.log(files);
 if(!len){return}
  if(files[0].name.toLowerCase().indexOf(".geojson") > -1) {
    while(i<len){
      console.log("geojson")
    handleGeosjon(files[i]);
    i++;
   }
  }
  else {
   while(i<len){
    handleFile(files[i]);
    i++;
   }
 }
}
        return div;
    }
});