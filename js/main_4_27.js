/* Rosemary Wardley: Geog 575-Final Project JS*/

var southWest = L.latLng(40.674342, -73.509922),
    northEast = L.latLng(42.661725, -69.493709),
    bounds = L.latLngBounds(southWest, northEast);
    console.log(bounds);

//function createMap(){ can't quite figure out what all needs to go in this
//create the map
var map = L.map('map',{
center:[41.713766, -71.549152],
zoom:10,
zoomControl: true,
/*layers: [historicRI,geoRI],*/
maxZoom: 13,
minZoom: 9,
maxBounds: bounds
});

map.zoomControl.setPosition('bottomright');

$('#show').hide();
$('#splash').click(function() {
    $('#show').show();
    $('#splash').hide();
});
$('#show').click(function() {
    $('#splash').show();
    $('#show').hide();
});

//add tile layer...replace project id and accessToken with your own
var light =
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',{
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery   <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.pencil',
    accessToken:'pk.eyJ1IjoicndhcmRsZXkiLCJhIjoiY2lzaTZrMzJ1MDAyazJ6b2NocHR4azM3ZCJ9.tuwmJFqCVSqf4TmTl8kJ6w'
}).addTo(map);

//add tercentenary image
var historicRI = 'data/RI_Ter_Rumsey.png';
var historicMapBounds = [[42.084461, -71.974372], [41.199603, -71.006617]];
var historicMapLayer = L.imageOverlay(historicRI, historicMapBounds);

//add GeoRef'd tercentenary image
var geoRI = 'data/RI_Rumsey_geo2.png';
var geoMapBounds = [[42.086, -71.929], [41.199, -71.04]];
var geoMapLayer = L.imageOverlay(geoRI, geoMapBounds);
geoMapLayer.addTo(map);

//create name for baseMap
var baseMap = {
    "<span style='color: gray'>Modern Map</span>": light
};

//create name for historic overlay png
var overlayMaps = {
    "R.I. Tercentenary Map": historicMapLayer,
    "Georeferenced Version": geoMapLayer
};
//need to figure out how to place this below the title?
L.control.layers(baseMap, overlayMaps).addTo(map);
//map.addControl(new L.Control.PanelLayers(baseMap, overlayMaps) );

//I want HistoricRI to load at first, not to be turned on click

 // if user selects one of the image layers, turn the other one off
  map.on('overlayadd', function(x) {
    if (x.name === "R.I. Tercentenary Map") {
      removeOpacitySlider();
      setTimeout(function() {
        addOpacitySlider(historicMapLayer);
        map.removeLayer(geoMapLayer)
      }, 10);
    } else if (x.name === "Georeferenced Version") {
      removeOpacitySlider();
      setTimeout(function() {
        addOpacitySlider(geoMapLayer);
        map.removeLayer(historicMapLayer)
      }, 10);
    }
  });

var opacitySlider = L.control({position: 'bottomright'});
opacitySlider.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'opacity-slider'); // create a div with a class "opacity-slider"
    this.update();
    return this._div;
};
// this is where the actual HTML for the custom control will go
opacitySlider.update = function (props) {
    this._div.innerHTML = '<p>Current opacity: <span id="current-opacity">100%</span></p><input type="range" id="opacity-changer" min="0" max="10" value="10"></input>';
};

function addOpacitySlider(currentLayer) {
    console.log(currentLayer);
    opacitySlider.addTo(map);
    // Disable dragging when user's cursor enters the element
    opacitySlider.getContainer().addEventListener('mouseover', function () {
        map.dragging.disable();
    });
    // Re-enable dragging when user's cursor leaves the element
    opacitySlider.getContainer().addEventListener('mouseout', function () {
        map.dragging.enable();
    });
    // create event listener for opacity range slider
    $("#opacity-changer").on("input", function(e) {
        var sliderValue = $(this).val();
        currentLayer.setOpacity(sliderValue / 10);
    $('#current-opacity').text((sliderValue * 10) + "%");
 });
}

function removeOpacitySlider() {
opacitySlider.remove();
}

$('#mapButton').click(function(){
    if(map.hasLayer(geoMapLayer)){
      map.removeLayer(geoMapLayer);
      //$(geoMapLayer).hide();
      $('#mapButtonText').text('Show Map');
      removeOpacitySlider();
} 
    else {
      $('#mapButtonText').text('Map Off');
      map.addLayer(geoMapLayer);
    }
});

//added at Example 2.3 line 20...function to attach popups to each mapped feature
/*function pointToLayer(feature, layer) {
    //no property named popupContent; instead, create html string with all properties
    var popupContent = "";
    if (feature.properties) {
        //loop to add feature property names and values to html string
        for (var property in feature.properties){
            popupContent += "<p>" + property + ": " + feature.properties[name] + "</p>";
        }
        layer.bindPopup(popupContent);
    };
    console.log(popupContent);
};*/

/*function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(feature.properties.popupContent);
    }
};*/

function pointToLayer(feature,latlng){
   var geojsonMarkerOptions = {
        radius: 8,
        fillColor: "white",
        color: "white",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.5
    };

    var popupContent = feature.properties.Name;
    console.log(popupContent);
    
    var layer = L.circleMarker(latlng, geojsonMarkerOptions);
    
    //bind the popup to the circle marker
    layer.bindPopup(popupContent);

    layer.on({
        mouseover: function() {
            this.openPopup();
        },
        mouseout: function() {
            this.closePopup();
        },
        //click: function() { console.log(panelConent)
            //$("#panel").html(panelContent);
        //}
    });

    return layer;
};

//do we need to put this in function getData(map)?
//load the data
$.ajax("data/map.json",{
dataType: "json",
    success: function(response){
        //create marker options
        /*var geojsonMarkerOptions = {
            radius: 8,
            fillColor: "white",
            color: "white",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.5
        };*/
        //create a Leaflet GeoJSON layer and add it to the map
        var infoPoints = L.geoJSON(response.features, {
            pointToLayer: pointToLayer
            /*pointToLayer: function (feature, latlng){
                //console.log(feature);
                //console.log(latlng);
                return L.circleMarker(latlng, geojsonMarkerOptions);
            }*/
      }).addTo(map);
    }
});

//$(document).ready(createMap);
/*map.on('click', onMapClick);*/