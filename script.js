var map;
var infoWindow;
var service;
var request;
var markers = [];

//setting initial center and showing nearby cafes
function initialize(){
  var center = new google.maps.LatLng(38.8976805, -77.0387185);
  map = new google.maps.Map(document.getElementById('map'), {
    center: center,
    zoom: 15
  });
  request = {
    location: center,
    radius: 2100, //in meters. equals 5 miles
    types: ['cafe']
  };

  infoWindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);

  service.nearbySearch(request, callback);

  //when you doubel click, will set a new center and find nearby cafe
  google.maps.event.addListener(map, 'dblclick', function(event){
    map.setCenter(event.latLng)
    clearResults(markers)

    request = {
      location: event.latLng,
      radius: 2000, // in meters. equals 5 miles
      types: ['cafe']
    };
    service.search(request, callback);
  })
}

//pushes all of the markers created into the markers array
function callback(results, status){
  if (status == google.maps.places.PlacesServiceStatus.OK){
    for (var i = 0; i < results.length; i++){
      //have to set limit to 9
      //otherwise even though markers show up, won't be able to show address
      //could pay for api to remove this limit
      if (markers.length < 9){
        markers.push(createMarker(results[i]));
      }
    }
  }
}

//creates a marker for each nearby cafe
function createMarker(place){
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
  });

  //have to set request to place.reference to get address of cafe
  //can also set request = {placeID: place.place_id}
  var request = { reference: place.reference };
  service.getDetails(request, function(details, status) {
    console.log(details)
    google.maps.event.addListener(marker, 'click', function() {
      infoWindow.setContent('<strong>' + details.name + '</strong><br />' + details.formatted_address +'<br />' + details.rating );
      infoWindow.open(map, this);
    });
  });
}

//will clear previous markes, so map isn't so cluttered
function clearResults(markers){
  for (var m in markers){
    markers[m].setMap(null)
  }
  markers = [];
}
