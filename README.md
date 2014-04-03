KuGIS
=====

KuGIS (Temporary name and logo for now. Ku=Cow in norwegian) is a simple GIS intended for introductory courses in GIS at NTNU, Trondheim, Norway. It was a developed as a project in the course "Programming in Geomatics" in the fall of 2013., there have been some continuing development this spring. The goal of the course is to develop a simple GIS software with the most basic spatial operations (buffers and overlays).


Result from a GIS analysis done in KuGIS
There are some introductory videos here. Titles are in norwegian but the interface is in English so it should be OK to follow the steps that are done.

It's meant to work on prepared datasets for a smaller region. Larger regions and more detailed datasets can be used but the interface and the geoprocessing will go slow. Also the memory usage will be very high.

The development version of Leaflet is used for presentation. So while Leaflet-0.8 is still in beta there may be some bugs, especially during initial loading. Refresh a couple of times if the map doesn't load.
JSTS is used for most spatial operations. Every geographic operation happens client side in a Web Worker so we don't lock up the UI during processing.

The application support drag and drop loading of local GeoJSON , shapefiles and files in the norwegian format SOSI. Shapefiles must be placed in a zip-file containing at least the three files *.shp, *.prj and *.dbf. For shapefile support I'm using the library shapefile-js and for SOSI I'm using the library SOSI.js

There's an introductory tutorial for some of the tools here

(Google translated so there are some errors, feet should be meters for example)

Limitations

Buffering are currently done in UTM N33 so there may be some distortions and scale errors in other parts of the world. This will be fixed soon.
Dissolve is very slow in the last steps of the operation
Detailed and large datasets should be prepared (generalized)
GeoJSON files containing more than one type of geometries are not supported yet.
FeatureExtractor gets the property keys for only the first Feature
