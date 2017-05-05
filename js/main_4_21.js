/* Example from Leaflet Quick Start Guide*/

var map = L.map('map').setView([41.713766, -71.549152], 10);

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
L.tileLayer('https://api.mapbox.com/styles/v1/rwardley/cj1i19dyd00212smodx5lzuc3/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicndhcmRsZXkiLCJhIjoiY2lzaTZrMzJ1MDAyazJ6b2NocHR4azM3ZCJ9.tuwmJFqCVSqf4TmTl8kJ6w',{
attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery   <a href="http://mapbox.com">Mapbox</a>',
maxZoom: 18,
//id: 'mapbox.outdoors',
//accessToken:'pk.eyJ1IjoicndhcmRsZXkiLCJhIjoiY2lzaTZrMzJ1MDAyazJ6b2NocHR4azM3ZCJ9.tuwmJFqCVSqf4TmTl8kJ6w'
}).addTo(map);


/*
//Step 3: Add circle markers for point features to the map
function createPropSymbols(data, map){
    //create marker options
    var geojsonMarkerOptions = {
        radius: 8,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }
    }).addTo(map);
};

//Step 2: Import GeoJSON data
function getData(map){
    //load the data
    $.ajax("data/MegaCities.geojson", {
        dataType: "json",
        success: function(response){
            //call function to create proportional symbols
            createPropSymbols(response, map);
        }
    });
};

var marker = L.marker([51.5, -0.09]).addTo(map);

var circle = L.circle([51.508, -0.11], 500, {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5
}).addTo(map);


var polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(map);

marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
circle.bindPopup("I am a circle.");
polygon.bindPopup("I am a polygon.");

var popup = L.popup()
    .setLatLng([51.5, -0.09])
    .setContent("I am a standalone popup.")
    .openOn(map);

var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}
*/
map.on('click', onMapClick);
