/* Example from Leaflet Quick Start Guide*/

var light =
L.Mapzen.apiKey = 'mapzen-ai57Egn';

/*var map = L.map('map').setView([41.713766, -71.549152], 10);*/
var map = L.Mapzen.map('map',{
    center:[41.713766, -71.549152],
    zoom:10,
    tangramOptions: {
        scene: L.Mapzen.BasemapStyles.Zinc},
    zoomControl: true,
    maxZoom: 13,
    minZoom: 9
});

map.zoomControl.setPosition('bottomright');

/*L.Control.Zoom ({
    position:'topright'
}).addTo(map);*/

$('#showSplash').hide();
$('#splash').click(function() {
    $('#showSplash').show();
    $('#splash').hide();
});
$('#showSplash').click(function() {
    $('#splash').show();
    $('#showSplash').hide();
});

//add tile layer...replace project id and accessToken with your own
/*var light =
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',{
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery   <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.pirates',
    accessToken:'pk.eyJ1IjoicndhcmRsZXkiLCJhIjoiY2lzaTZrMzJ1MDAyazJ6b2NocHR4azM3ZCJ9.tuwmJFqCVSqf4TmTl8kJ6w'
}).addTo(map);*/

//add tercentenary image
var historicRI = 'data/RI_Ter_Rumsey.png';
var historicMapBounds = [[42.084461, -71.974372], [41.199603, -71.006617]];
var historicMapLayer = L.imageOverlay(historicRI, historicMapBounds);

//add GeoRef'd tercentenary image
var geoRI = 'data/RI_Rumsey_geo2.png';
var geoMapBounds = [[42.086, -71.929], [41.199, -71.04]];
var geoMapLayer = L.imageOverlay(geoRI, geoMapBounds);

//create name for baseMap
var baseMap = {
    "Modern Map": light
};

//create name for historic overlay png
var overlayMaps = {
    "R.I. Tercentenary Map": historicMapLayer,
    "Georeferenced Version": geoMapLayer
};
//need to figure out how to place this below the title?
L.control.layers(baseMap, overlayMaps).addTo(map);

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

//load the data
$.ajax("data/map.json",{
dataType: "json",
    success: function(response){
        //create marker options
        var geojsonMarkerOptions = {
            radius: 10,
            fillColor: "#ff7800",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };
        //create a Leaflet GeoJSON layer and add it to the map
        var infoPoints = L.geoJSON(response.features, {
            pointToLayer: function (feature, latlng){
                //console.log(feature);
                //console.log(latlng);
                return L.circleMarker(latlng, geojsonMarkerOptions);
            }
      }).addTo(map);
    }
});

map.on('click', onMapClick);
