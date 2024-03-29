/* Rosemary Wardley: Geog 575-Final Project JS*/

var southWest = L.latLng(41.142326, -72.714898),
    northEast = L.latLng(42.397286, -70.522243),
    bounds = L.latLngBounds(southWest, northEast);
    //console.log(bounds);

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

$('#homeButton').on({
    hover: function(){
        $this.css('color', 'white');
    },
    click: function(){
        map.setView([41.713766, -71.549152], 10, true);
    }
});
    
//$('#homeButton').click(function(){
//    map.setView([41.713766, -71.549152], 10, true);
//});

$('.show').hide();
$('#splash').click(function() {
    $('.show').show();
    $('#splash').hide();
});
$('.show').click(function() {
    $('#splash').show();
    $('.show').hide();
});

//replacing defunct Mapbox tiles
var light =
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',{
    attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: 'mapbox/light-v11',
    //opacity: 0.65,
    accessToken:'pk.eyJ1IjoicndhcmRsZXkiLCJhIjoiY2lzaTZrMzJ1MDAyazJ6b2NocHR4azM3ZCJ9.tuwmJFqCVSqf4TmTl8kJ6w'
}).addTo(map);


// //add tile layer...replace project id and accessToken with your own
// var light =
// L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',{
//     attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery   <a href="http://mapbox.com">Mapbox</a>',
//     maxZoom: 18,
//     id: 'mapbox.pirates',
//     opacity: 0.65,
//     accessToken:'pk.eyJ1IjoicndhcmRsZXkiLCJhIjoiY2lzaTZrMzJ1MDAyazJ6b2NocHR4azM3ZCJ9.tuwmJFqCVSqf4TmTl8kJ6w'
// }).addTo(map);

//I want HistoricRI to load at first, not to be turned on click
//add GeoRef'd tercentenary image
/*var geoRI = 'data/RI_Rumsey_geo3.png';
var geoMapBounds = [[42.104981, -71.974372], [41.179703, -71.006608]];
var geoMapLayer = L.imageOverlay(geoRI, geoMapBounds).addTo(map);

//adding small image for mobile
var geoRI_sm = 'data/RI_Rumsey_geo3_small.png';
var geoMapBounds_sm = [[42.104981, -71.974372], [41.179703, -71.006608]];
var geoMapLayer_sm = L.imageOverlay(geoRI_sm, geoMapBounds_sm).addTo(map);*/

if (window.matchMedia("(min-width: 400px)").matches) {
  /* the viewport is at least 400 pixels wide */
    var geoRI = 'data/RI_Rumsey_geo4.png';

} else {
  /* the viewport is less than 400 pixels wide */
    var geoRI = 'data/RI_Rumsey_geo4_small.png';
}
var geoMapBounds = [[42.104981, -71.974372], [41.179703, -71.006608]];
var geoMapLayer = L.imageOverlay(geoRI, geoMapBounds).addTo(map);

function updateOpacity(value) { console.log(updateOpacity);
    geoMapLayer.setOpacity(value);
}

$('#slide').on("input", function(){
  var value = $(this).val()
  updateOpacity(value)
    console.log(value);
});

$('#mapButtonCheckBox').click(function(){
    if(map.hasLayer(geoMapLayer)){
      map.removeLayer(geoMapLayer);
} 
    else {
      map.addLayer(geoMapLayer);
    }
});

function pointToLayer(feature,latlng){
   var geojsonMarkerOptions = {
        radius: 8,
        color: "white",
        //color: "white",
        fillColor: "#f5666a",
        weight: 1.25,
        opacity: 1,
        fillOpacity: 0.5
    };

    var popupContent = '<a href="' + feature.properties.Wiki + '" target="_blank">' + feature.properties.Name + '</a>';
    //var popupContent = feature.properties.Name;
    //console.log(popupContent);
    
    var layer = L.circleMarker(latlng, geojsonMarkerOptions);
    
    //bind the popup to the circle marker
    layer.bindPopup(popupContent);

    layer.on({
        mouseover: function() {
//             var popupContent = feature.properties.Name;
             this.openPopup();
        },
        mouseout: function() {
            //this.closePopup();
        },
        click: function() {
//            var popupContent = feature.properties.Wiki;
            this.openPopup();
        }
    });

    return layer;
};

//do we need to put this in function getData(map)?
//load the data
$.ajax("data/map.json",{
dataType: "json",
    success: function(response){
        //create a Leaflet GeoJSON layer and add it to the map
        var infoPoints = L.geoJSON(response.features, {
            pointToLayer: pointToLayer
      }).addTo(map);
    }
});

//$(document).ready(createMap);
/*map.on('click', onMapClick);*/