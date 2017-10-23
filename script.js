var map;
var infoWindow;
var service;
var request;
var markers = [];

function initialize(){
  var center = new google.maps.LatLng(37.4222, -122.084058);
  var center2 = new google.maps.LatLng(37.7749, -122.4194);
  map = new google.maps.Map(document.getElementById('map'), {
    center: center,
    zoom: 12
  });
  request = {
    location: center,
    radius: 8047, //in meters. equals 5 miles
    types: ['cafe']
  };

  infoWindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);

  service.nearbySearch(request, callback);

  google.maps.event.addListener(map, 'dblclick', function(event){
    map.setCenter(event.latLng)
    clearResults(markers)

    request = {
      location: event.latLng,
      radius: 8047, // in meters. equals 5 miles
      types: ['cafe']
    };
    service.nearbySearch(request, callback);
  })
}

function callback(results, status){
  if (status == google.maps.places.PlacesServiceStatus.OK){
    for (var i = 0; i < results.length; i++){
      markers.push(createMarker(results[i]));
    }
  }
}

function createMarker(place){
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });
  google.maps.event.addListener(marker, 'click', function() {
    infoWindow.setContent(place.name);
    infoWindow.open(map, this);
  });
  return marker
}

function clearResults(markers){
  for (var m in markers){
    markers[m].setMap(null)
  }
  markers = [];
}

google.maps.event.addDomListener(window, 'load', initialize);
