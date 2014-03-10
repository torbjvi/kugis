// An invisible leaflet "control" that handles dragging and dropping of files.
var NewButton= L.Control.extend({//creating the buttons
    options: {
        position: 'topleft'
    },
    onAdd: function (map) {
      this._map = map;
        // create the control container with a particular class name
        var div = L.DomUtil.create('form','bgroup');
        div.id="dropzone";
        
   function handleFile(file){ // functions that handles the result of a shapefile conversion and adds it to the map
    
    
  
    var addIt = function(geoJson){

       layerlist.addLayer(geoJson.fileName, geoJson);


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
              },function(a){});
           }
       };
           reader.readAsArrayBuffer(file);
   }
    function handleGeosjon(file){
    var addIt = function(geoJson){
       layerlist.addLayer( geoJson.fileName, geoJson);
    }
        var reader = new FileReader();
        reader.onload=function(){
            if(reader.readyState !== 2 || reader.error){
              return;
            }else{
              var geojson = JSON.parse(reader.result);

              if(geojson.crs && geojson.crs.properties && geojson.crs.properties.name.indexOf("4326") == -1) {
                var crs =  geojson.crs.properties.name.replace("urn:ogc:def:crs:", "").replace("::", ":");
                WktUtils.reprojectGeoJson(geojson, crs, "epsg:4326", 8, function (geojson) {
                  
                  geojson.fileName = file.name.toLowerCase().replace(".geojson", "");
                  addIt(geojson);
                  
                });
              }
              else{
                  geojson.fileName = file.name.toLowerCase().replace(".geojson", "");
                  addIt(geojson);
              }
              
           }
       };
           reader.readAsText(file);
   }
   function handleSosiFile(file) {
      var addIt = function(geoJson){
       layerlist.addLayer( geoJson.fileName, geoJson);
    }
        var reader = new FileReader();
        reader.onload=function(){
            if(reader.readyState !== 2 || reader.error){
              return;
            }else{
              var worker = new Worker("workers/sosiimporter.js");
              worker.onmessage = function (evt) {
                var geojson = evt.data;
                   geojson.fileName = file.name.toLowerCase().replace(".sos", "");
                 
                WktUtils.reprojectGeoJson(geojson, geojson.crs.properties.name, "epsg:4326", 8, function (geojson) {
                  geojson.fileName = file.name.toLowerCase().replace(".sos", "");
                  addIt(geojson);
                  
                });
              }
              worker.postMessage(reader.result);
              

              
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
 if(!len){return}
  if(files[0].name.toLowerCase().indexOf(".geojson") > -1 || files[0].name.toLowerCase().indexOf(".json") > -1) {
    while(i<len){
    handleGeosjon(files[i]);
    i++;
   }
  }
  else if(files[0].name.toLowerCase().indexOf(".sos") > -1) {
    while(i<len){
    handleSosiFile(files[i]);
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