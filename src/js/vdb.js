var NUM_OF_MARKERS = 200;

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

var randomData = function() {
  var car;
  var size;
  var weight;
  var id;
  var lat;
  var long;
  var res = [];
  for (var i = 0 ; i < NUM_OF_MARKERS ; i++) {
    car = CAR_TYPES[Math.floor(getRandom(1,4))];
    size = CAR_SIZE[Math.floor(getRandom(1,4))];
    weight = Math.floor(getRandom(0,600));
    lat = 32.882206 + Math.random() / 100000;
    long = -117.229898 + Math.random() / 100000;
    res.push({id:i,loc: new google.maps.LatLng(lat,long),type: car,size:size,weight:weight});
  }
  
  return res;
}


var ORIGINAL_DATA;

var FILTERS = {
  TYPE: 0,
  SIZE: 1,
  WEIGHT:2
};

 var CAR_TYPES = ['All','Car','Truck','Van'];
 var CAR_SIZE = ['All','Small','Medium','Large'];
 var CAR_WEIGHT = [0,100,200,300,400,500];
 
 
 
 // Simulates live data by manipulating the marker locations
var updateLocations = function() {
  var curr_data = ORIGINAL_DATA;
      for (var i = 0 ; i < curr_data.length/2 ; i++) { 
        var lat = curr_data[i].loc.lat() + (Math.random()/1000);
        var lng = curr_data[i].loc.lng() + (Math.random()/1000);
        var newLoc = new google.maps.LatLng(lat.toFixed(6),lng.toFixed(6));
        ORIGINAL_DATA[i].loc = newLoc;
      } 
      
      // setProps triggers the chain to re-render (or update) the app
      appReference.setProps({data: ORIGINAL_DATA});
}


// Constantly updates locations of ORIGINAL_DATA  
setInterval(function() {
  updateLocations();
  }, 150);