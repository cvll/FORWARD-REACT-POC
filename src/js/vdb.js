var NUM_OF_MARKERS = 3;
var sign_flag = false;

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

var randomData = function() {
  var car;
  var size;
  var color;
  var id;
  var lat;
  var long;
  var res = {};

  for (var i = 0 ; i < NUM_OF_MARKERS ; i++) {
    car = CAR_TYPES[Math.floor(getRandom(1,4))];
    size = CAR_SIZE[Math.floor(getRandom(1,4))];
    color = CAR_COLOR[Math.floor(getRandom(1,4))];
    if (sign_flag) {
      lat = 32.882206 + Math.random() / 100000;
      long = -117.229898 + Math.random() / 100000;
    } else {
      lat = 32.882206 - Math.random() / 100000;
      long = -117.229898 - Math.random() / 100000;
    }
    sign_flag = !sign_flag;
    res[i] = {id:i,loc: new google.maps.LatLng(lat,long),type: car,size:size,color:color,visibility:true};
  }
  
  return res;
}


var ORIGINAL_DATA;

var FILTERS = {
  TYPE: 0,
  SIZE: 1,
  COLOR:2
};

 var CAR_TYPES = ['All','Car','Truck','Van'];
 var CAR_SIZE = ['All','Small','Medium','Large'];
 var CAR_COLOR = ['All','Red','Blue','Green'];
 
 
 // Simulates live data by manipulating the marker locations
var updateLocations = function() {
  var curr_data = ORIGINAL_DATA;
  var lat;
  var lng;
  
  for (var i in curr_data) {
    if(curr_data.hasOwnProperty(i)) {
      if (sign_flag) {
        lat = curr_data[i].loc.lat() + (Math.random()/1000);
        lng = curr_data[i].loc.lng() + (Math.random()/1000);
      } else {
        lat = curr_data[i].loc.lat() - (Math.random()/1000);
        lng = curr_data[i].loc.lng() - (Math.random()/1000);
      }
      var newLoc = new google.maps.LatLng(lat.toFixed(6),lng.toFixed(6));
      ORIGINAL_DATA[i].loc = newLoc;
    }
  }
   sign_flag = !sign_flag;   
      // setProps triggers the chain to re-render (or update) the app
      appReference.setProps({data: ORIGINAL_DATA});
}


