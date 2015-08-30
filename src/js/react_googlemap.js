// React Google Component

/* 8/29: Now updated to use a 'dictionary' of markers with the index as its key
         Prop locations represent changes in data. Presumes no change if marker not in new props
*/

var MyGoogleMap = React.createClass({displayName: "MyGoogleMap",
  // starting state
  getInitialState: function() {
    return {map:null,markers: {}};
  },
  
  //Given a key and location, updates state.marker to new position and to visible
  displayMarker: function(key,loc) {
    if (this.state.markers[key].getPosition() != loc)
      this.state.markers[key].setPosition(loc);
      
    this.state.markers[key].setVisible(true);
  },
  // Given a key, hides respective marker
  hideMarker: function(key) {      
    this.state.markers[key].setVisible(false);
  },
  handleMarkerChange: function(key,loc) {
    if (loc.visibility) {
      this.displayMarker(key,loc.loc);
    } else {
      this.hideMarker(key);
    }
  },
  // Triggered on new props, updates all markers to not visible or visible with new position
  componentWillReceiveProps: function(nextProps) {
    var locs = nextProps.locations;
    var markers = this.state.markers;
    
    // Iterates through all markers, seeking existence in props
    for (var key in locs) {
      if (locs.hasOwnProperty(key)) {
          if (markers[key]) {
            this.handleMarkerChange(key,locs[key]); 
          } else {
            this.state.markers[key] = this.createMarker(this.state.map,locs[key].loc);
          }
      }
    } 
  },
  
  // Returns a new marker with given location on respective map
  createMarker: function(map_ptr,loc) {
    return new google.maps.Marker({
            position: loc.coords,
            map: map_ptr,
      }); 
  },
  
  // Invoked only once, sets up map and markers for first time
  componentDidMount: function() {
    var tmp_markers = {};
    
    var tmp_map = new google.maps.Map(React.findDOMNode(this), {
      center: {lat: 32.879632, lng: -117.235687},
      zoom: 15,
      });
     
    var prop_locs = this.props.locations;
    
    // Creates marker for each location and saves it in state.marker
    for (var key in prop_locs) {
      if (prop_locs.hasOwnProperty(key)) {
        tmp_markers[key] = this.createMarker(tmp_map,{key:key,coords: prop_locs[key].loc});
      }
    }
    
    this.setState({map:tmp_map,markers:tmp_markers});
  },
  render: function() {
    return React.createElement('div',{id:'gmap'});
  }
});
