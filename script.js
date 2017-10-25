var map;
var infoWindow;
var service;
var request;
var markers = [];
var htmls = [];
var to_htmls = [];
var from_htmls = [];

function initialize(){
  //creates initial starting point
  var center = new google.maps.LatLng(37.4222, -122.084058);
  map = new google.maps.Map(document.getElementById('map'), {
    center: center,
    zoom: 12
  });

  //finding cafes within 5miles of starting location
  request = {
    location: center,
    radius: 8047, //in meters. equals 5 miles
    types: ['cafe']
  };

  infoWindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);

  service.nearbySearch(request, callback);

  //setting new center
  //will clear previous markers and create new ones
  google.maps.event.addListener(map, 'dblclick', function(event){
    map.setCenter(event.latLng)
    clearResults(markers)
    console.log(markers.length)

    request = {
      location: event.latLng,
      radius: 8047, // in meters. equals 5 miles
      types: ['cafe']
    };
    service.nearbySearch(request, callback);
  })
}

//pushing map markers into markers array
//has to be less than 9, otherwise can't see address
function callback(results, status){
  if (status == google.maps.places.PlacesServiceStatus.OK){
    for (var i = 0; i < 9; i++){
      markers.push(createMarker(results[i]));
    }
  }
}

//creating map markers for each cafe found
function createMarker(place){
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  //when you click on a map marker, will show name, address, and rating
  var request = { reference: place.reference };
  service.getDetails(request, function(details, status) {
    google.maps.event.addListener(marker, 'click', function() {
      infoWindow.setContent('<strong>' + details.name + '</strong><br>' + details.formatted_address + '<br>' +
                              details.rating + '/5 stars<br> Open Now: ' + details.opening_hours.open_now + '<br> Closes at: ' +
                              details.opening_hours.periods[0,1,2,3,4,5,6].close.time +
                              `<br>Directions: <a href="https://www.google.com/maps/dir/?api=1&destination=${details.formatted_address} "target = _blank"">To here<\/a>`);
      infoWindow.open(map, this);
    });
  })
  return marker
}

//clears the previously made markers when you create a new center
function clearResults(markers){
  for (var m in markers){
    markers[m].setMap(null)
  }
  markers = [];
}

google.maps.event.addDomListener(window, 'load', initialize);
