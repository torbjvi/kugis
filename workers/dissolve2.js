importScripts('../libs/javascript.util.js', '../libs/jsts.js'); 
var disjoints = [];
var reader = new jsts.io.GeoJSONReader();
var parser =  new jsts.io.GeoJSONParser();
onmessage = function(evt) {
  var geojson = evt.data.geojson;
  if( !geojson.features[0].properties["kugisCreated"] && geojson.features[0].type.indexOf('olygon') > 0 ) {
    for(var i = 0; i<geojson.features.length;i++) {

      var f2 = reader.read(geojson.features[i]);
      f2.geometry = f2.geometry.buffer(0.0000000001); // This fixes a lot of errors with this process
      geojson.features[i].geometry = parser.write(f2.geometry); 
    }
  }
  while(geojson.features.length >0) {
    var f1 = reader.read(geojson.features.shift());
    disjoint = true;
    var g1 = f1.geometry;
    for (var i = 0; i<geojson.features.length;i++) {
      var f2 = reader.read(geojson.features[i]);
      var g2 = f2.geometry;
    
      if(g1.intersects(g2)) {
        geojson.features.splice(i,1);
        union = g1.union(g2);
        disjoint = false;
        break;
      }
    
    }
    if(disjoint)
      disjoints.push(g1);
    else {
      f1.geometry = parser.write(union);
      geojson.features.push(f1);
    }
    postMessage({msg: "update"});
  }
  var fc = {type: "FeatureCollection", features: [], properties: { kugis: true } };
  for(var i =0;i<disjoints.length;i++) {
    var feature = { type: "Feature", geometry: parser.write(disjoints[i]), properties: {} };
    feature.properties["kugisCreated"] = "true";
    fc.features.push(feature);
  }
  postMessage({geojson: fc, disjoints: disjoints});

}