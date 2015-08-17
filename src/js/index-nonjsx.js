var mountNode = document.getElementById('map');
var map;
//var data;
var ref;
var filterRef;
var item_data;
var ORIGINAL_DATA;
var fNode = document.getElementById('filter');

var notifyFunc = function(cat) {
  this.setState({filter:cat});
};


var updateLocations = function() {
  var curr_data = ref.getLocations();
      for (var i = 0 ; i < curr_data.length ; i++) { 
        var lat = curr_data[i].loc.lat() + (Math.random()/1000);
        var lng = curr_data[i].loc.lng() + (Math.random()/1000);
        var newLoc = new google.maps.LatLng(lat.toFixed(6),lng.toFixed(6));
        newLoc.category = curr_data[i].category;
        ref.updateMarkerLocation(i,newLoc);
      } 
}

var MyFilterComponent = React.createClass({displayName:"MyFilterComponent",
    getInitialState: function() {
      return {filter:'All'};
    },
    onChange: function() {
      var dom = this.getDOMNode();
      var newCategory = dom.options[dom.options.selectedIndex].value;
      
      this.setState({filter: newCategory});
      
      this.props.map.notify(ref,newCategory);
    },
    render: function() {
      var createOption = function(item,idx) {
        return React.createElement('option',{value:item},item);
      }
      return React.createElement('select',{onChange:this.onChange},this.props.items.map(createOption,this));
    }
});


var MyGoogleMap = React.createClass({displayName: "MyGoogleMap",
  // starting state
  getInitialState: function() {
    return {filter:'All',initial:true,markers: []};
  },
  getMarkers() {
    return this.state.markers;
  },
  getLocations() {
    var locs =[];
    
    for (var i =0 ; i < this.state.markers.length ; i++) {
      var curr = this.state.markers[i];
      locs.push({loc: curr.getPosition(),category:curr.category});
    }
    
    return locs;
  },
  // used to update marker locations
  updateMarkerLocation: function(i,loc) {
    var m = this.getMarkers();
    m[i].setPosition(loc);
  },
  // used to notify the map there was an update
  notify: function(obj,newState) {
    // binds 'this'
    this.props.notify.bind(obj);
    var tmp = this.props.notify.bind(obj);
    
    // executes the provided notify method
    tmp(newState);
  },
  deleteMarkers() {
    var m = this.state.markers;
    
    for (var i = 0 ; i < m.length; i++) {
      m[i].setMap(null);
      delete m[i];
    }
    this.setState({markers:[]});
  },
  showAllMarkers: function() {
    var m = this.getMarkers();
    for (var i = 0;  i < m.length ; i++) {
      m[i].setMap(map);
    }
  },
  render: function() {
    if (!map) {
      this.state.initial = false;
      
      // create the map
      map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 32.879632, lng: -117.235687},
        zoom: 15,
        offsetWidth: 0
      });
      
    

      var createMarkers = function(o,idx) {
        var loc = o.loc;
        var map_holder = o.category == this.state.filter || this.state.filter == 'All' ? map : null;
        var marker = new google.maps.Marker({
              position: loc,
              map: map_holder,
              category: o.category
        });
        this.state.markers[idx] = marker;
        return React.createElement('noscript',{key:idx,category:o.category},idx);
      }
      return React.createElement('div',null,this.props.locations.map(createMarkers,this));
    } else {
      
      var m = this.getMarkers();
      
      if (this.state.filter == 'All') {
        this.showAllMarkers();
      } else {
        for (var i = 0 ; i < m.length ; i++) {
          if (m[i].category == this.state.filter) {
            m[i].setMap(map);
          } else {
            m[i].setMap(null);
          }
        }
      }
      return null;
    }
  }
});


var init = function() {
  
  ORIGINAL_DATA = [
   {loc: new google.maps.LatLng (32.879632,-117.235687), category: 'Car'},
   {loc: new google.maps.LatLng (32.882206, -117.229898), category: 'Car'},
   {loc: new google.maps.LatLng (32.880746, -117.238288), category: 'Truck'},
   {loc: new google.maps.LatLng (32.881755, -117.235091), category: 'Truck'},
   {loc: new google.maps.LatLng (32.876998, -117.235048), category: 'Van'}
];
  //data = ORIGINAL_DATA;
  
  
  item_data = ['All','Car','Truck'];
 
  ref = React.render(React.createElement(MyGoogleMap, {locations:ORIGINAL_DATA,notify:notifyFunc}), mountNode);
  
  filterRef = React.render(React.createElement(MyFilterComponent,{items:item_data,map:ref}),document.getElementById('filter'));
  
  
  
  
  
  
  
  
  
  
  setInterval(function() {
    //console.log("interval running..");
      updateLocations();
    //console.log("interval done!");
     }, 150);
  
}

