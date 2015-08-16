var map;
var markers;

// generate the map
function initMap() {
  // create the map
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 32.879632, lng: -117.235687},
    zoom: 15
  });
 
  //generate the markers
  //markers = generateMarkers(map);
}


// takes json data and creates markers for each
// Also contains an additional _id to help identify each marker
var generateMarkers = function(map) {
    var res = [];
  	for (var i = 0; i < data.length ; i++) {
		res.push(new google.maps.Marker({
					  _id: data[i].id,
    				position: new google.maps.LatLng(data[i].lat, data[i].lng),
    				map: map,
				})
		);
	}
  return res;
}


