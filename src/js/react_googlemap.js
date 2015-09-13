// React Google Component

var MyGoogleMap = React.createClass({displayName: "MyGoogleMap",
  // starting state
  getInitialState: function() {
    return {map: null, markers: {}};
  },
  
  displayMarker: function(dataObj) {
    var key = dataObj.id;
    var loc = dataObj.loc;
    
    if (this.state.markers[key].getPosition() != loc)
      this.state.markers[key].setPosition(loc);
      
    this.state.markers[key].setVisible(true);
  },
  
  hideMarker: function(dataObj) {      
    this.state.markers[dataObj.id].setVisible(false);
  },
  
  deleteMarker: function(id) {
    this.state.markers[id].setPosition(null);
    this.state.markers[id].setMap(null);
    this.state.markers[id].setVisible(false);
    
    delete this.state.markers[id];
  },
  
  createMarker: function(dataObj) {
    var loc = dataObj.loc;
    var key = dataObj.id;
    var marker;
    
    if (this.state.markers[key]) {
      //creating marker that already exists
      console.log("ERROR: This should never happen");
    }
    
    marker = new google.maps.Marker({
                                position: loc,
                                map: this.state.map,
                                label: String.fromCharCode(65 + key),
                                dataObject: dataObj,
                                visible: dataObj.visibility
    }); 
    
    // function used to create popup windows on click
    var createInfoWindow = function(obj) {
      var res = "";
          for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
              res += "<p>" + key + " : " + obj[key] + "</p>";
            }
          }
          
      return new google.maps.InfoWindow({
                    content: res
                 });
    }
    
    // add listener to create and display window on click
    marker.addListener('click', function() {
      var infoWindow = createInfoWindow(this.dataObject);
      infoWindow.open(this.map,this);
    });
    
    return marker;
   
  },
  
  updateMarker: function(dataObj) {
    var curr_marker = this.state.markers[dataObj.id];
    
    if (dataObj.loc != curr_marker.getPosition()) {
      curr_marker.setPosition(dataObj.loc);
    }
    
    curr_marker.setVisible(dataObj.visibility);
    
  },
  
  handleMarkerChange: function(dataObj) {
    var key = dataObj.id;
    
    if (!this.state.markers[key]) {
      this.state.markers[key] = this.createMarker(dataObj);
    } else {
      this.updateMarker(dataObj);
    }
  },
  
  handleMarkerPing: function(id) {
    if (this.props.ping)
      this.state.markers[this.props.ping].setAnimation(null);
      
    if (id)
      this.state.markers[id].setAnimation(google.maps.Animation.BOUNCE);
  },
  // Triggered on new props, updates all markers to not visible or visible with new position
  componentWillReceiveProps: function(nextProps) {
    var changeSet = nextProps.locations;

    // handle marker deletes
    for (var key in this.state.markers) {
      if (this.state.markers.hasOwnProperty(key)) {
        if (!changeSet[key])
          this.deleteMarker(key);
      }
    }
    
    //handle marker adds/modificiations
    for (var key in changeSet) {
      if (changeSet.hasOwnProperty(key)) {
        this.handleMarkerChange(changeSet[key]); 
      }
    }
    
    this.handleMarkerPing(nextProps.ping);
    this.forceUpdate(); 
  },
  initMap: function() {
    this.state.map = new google.maps.Map(React.findDOMNode(this), {
      center: {lat: 32.879632, lng: -117.235687},
      zoom: 15,
      });
  },
  initMarkers: function() {
    var prop_locs = this.props.locations;
    
    for (var key in prop_locs) {
      if (prop_locs.hasOwnProperty(key)) {
        this.state.markers[key] = this.createMarker(prop_locs[key]);
      }
    }
    
  },
  // Invoked only once, sets up map and markers for first time
  componentDidMount: function() {
    this.initMap();
    this.initMarkers();
  },
  render: function() {
    return React.createElement('div',{id:'gmap'});
  }
});
