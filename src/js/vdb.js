var ORIGINAL_DATA;


 var CAR_TYPES = ['All','Car','Truck','Van'];
 var CAR_SIZE = ['All','Small','Medium','Large'];
 var CAR_WEIGHT = [0,100,200,300,400,500];
 
 // Simulates live data by manipulating the marker locations
var updateLocations = function() {
  var curr_data = reactMapReference.getLocations();
      for (var i = 0 ; i < curr_data.length ; i++) { 
        var lat = curr_data[i].loc.lat() + (Math.random()/1000);
        var lng = curr_data[i].loc.lng() + (Math.random()/1000);
        var newLoc = new google.maps.LatLng(lat.toFixed(6),lng.toFixed(6));
        newLoc.category = curr_data[i].category;
        reactMapReference.updateMarkerLocation(i,newLoc);
      } 
}
/*
  // Used to simulate live data by constantly updating the marker locations

     */