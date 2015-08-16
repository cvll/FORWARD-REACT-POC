var mountNode = document.getElementById('map');
var map;
var data;
var ref;
var filterRef;
var item_data;
/*var MyMarker = React.createClass({displayName: "MyMarker",
  render: function() {
    var marker = new google.maps.Marker({
    				position: this.props.loc,
    				map: map
				});
    return React.createElement('noscript',/*{key:this.props.key}*///null,null);
  /*}
  
});*/


var updateLocations = function() {
  var newData = []
      for (var i = 0 ; i < data.length ; i++) { 
        var lat = data[i].lat() + (Math.random()/1000);
        var lng = data[i].lng() + (Math.random()/1000);
        newData.push(new google.maps.LatLng(lat.toFixed(6),lng.toFixed(6)));
      } 
      
    ref.updateMarkerLocation(newData);
}

var MyFilterComponent = React.createClass({displayName:"MyFilterComponent",
    getInitialState: function() {
      return {filter:'All'};
    },
    onChange: function() {
      console.log("change happened");
    },
    render: function() {
      var createOption = function(item,idx) {
        return React.createElement('option',{value:item},item);
      }
      return React.createElement('select',{onChange:this.onChange},this.props.items.map(createOption,this));
    }
});


var MyGoogleMap = React.createClass({displayName: "MyGoogleMap",
  getInitialState: function() {
    return {initial:true,markers: []};
  },
  updateMarkerLocation: function(locs) {
    for (var i = 0 ; i < locs.length ; i++) {
      var tmp = this.state.markers[i].getPosition();
          this.state.markers[i].setPosition(locs[i]);
    }
    this.props.locations = locs;
    this.setState({markers:this.state.markers});
  },
  render: function() {
    
    if (this.state.initial) {
      this.state.initial = false;
      // create the map
      map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 32.879632, lng: -117.235687},
        zoom: 15,
        offsetWidth: 0
      });
      
      var createMarkers = function(loc,idx) {
        var marker = new google.maps.Marker({
              position: loc,
              map: map
        });
        this.state.markers[idx] = marker;
        return React.createElement('noscript',{key:idx},idx);
      }
      return React.createElement('div',null,this.props.locations.map(createMarkers,this));
    }
    else {
      
      return ref;
    }
  }
});




var init = function() {
  
  data = [
   new google.maps.LatLng (32.879632,-117.235687),
   new google.maps.LatLng (32.882206, -117.229898),
   new google.maps.LatLng (32.880746, -117.238288),
   new google.maps.LatLng (32.881755, -117.235091),
   new google.maps.LatLng (32.876998, -117.235048)
];
  item_data = ['All','Car','Truck'];
  var fNode = document.getElementById('filter');
  ref = React.render(React.createElement(MyGoogleMap, {locations:data}), mountNode);
  filterRef = React.render(React.createElement(MyFilterComponent,{items:item_data}),document.getElementById('filter'));
  setInterval(function() {
    console.log("interval running..");
      updateLocations();
    console.log("interval done!");
     }, 150);
  
}

