// React Google Component
var MyGoogleMap = React.createClass({displayName: "MyGoogleMap",
  // starting state
  getInitialState: function() {
    // privateize createMarker function in state
    var f = function(loc,idx) {
      var marker = new google.maps.Marker({
            position: loc,
            map: this.state.map,
      });
      this.state.markers[idx] = marker;
    } 
   
    return {createMarkers:f, map:null,markers: []};
  },
  createMap: function() {
      // create the map
  },
  getLocations: function() {
    var locs =[];
    
    for (var i =0 ; i < this.state.markers.length ; i++) {
      var curr = this.state.markers[i];
      locs.push(curr.getPosition());
    }
    
    return locs;
  },
  // used to update a marker's location
  updateLocation: function(i,loc) {
    
    var m = this.getMarkers();
    m[i].setPosition(loc);
   
  },
  componentDidMount: function() {
    var tmp_map = new google.maps.Map(React.findDOMNode(this), {
        center: {lat: 32.879632, lng: -117.235687},
        zoom: 15,
      });
  },
  hideLocation: function(i) {
    this.state.markers[i].setVisibility(false);
  },
  showLocation: function(i) {
    this.state.markers[i].setVisibility(true);
  },
  deleteAllLocations: function() {
    var m = this.state.markers;
    
    for (var i = 0 ; i < m.length; i++) {
      m[i].setMap(null);
      delete m[i];
    }
    this.setState({markers:[]});
  },
  showAllLocations: function() {
    var m = this.getMarkers();
    for (var i = 0;  i < m.length ; i++) {
      m[i].setMap(this.state.map);
    }
  },
  
  render: function() {
    this.props.locations.map(this.state.createMarkers,this);
    return React.createElement('div',{id:'gmap'});
  }
});
