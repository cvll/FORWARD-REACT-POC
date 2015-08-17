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
        var lat = data[i].loc.lat() + (Math.random()/1000);
        var lng = data[i].loc.lng() + (Math.random()/1000);
        newData.push(new google.maps.LatLng(lat.toFixed(6),lng.toFixed(6)));
      } 
      data = newData;
   // ref.updateMarkerLocation(newData);
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
  getInitialState: function() {
    return {initial:true,markers: []};
  },
  updateMarkerLocation: function(locs) {
    for (var i = 0 ; i < locs.length ; i++) {
          if (locs[i]) {
            locs[i].category = this.state.markers[i].getPosition().category;
            this.state.markers[i].setPosition(locs[i]);
          }
    }
    this.props.locations = locs;
    this.setState({markers:this.state.markers});
  },
  notify: function(obj,newState) {
    this.props.notify.bind(obj);
    var tmp = this.props.notify.bind(obj);
    tmp(newState);
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
      
      var createMarkers = function(o,idx) {
        var loc = o.loc;
        var marker = new google.maps.Marker({
              position: loc,
              map: map,
              category: o.category
        });
        this.state.markers[idx] = marker;
        return React.createElement('noscript',{key:idx,category:o.category},idx);
      }
      return React.createElement('div',null,this.props.locations.map(createMarkers,this));
    }
    else {
      
      return null;
    }
  }
});


var init = function() {
  
  data = [
   {loc: new google.maps.LatLng (32.879632,-117.235687), category: 'Car'},
   {loc: new google.maps.LatLng (32.882206, -117.229898), category: 'Car'},
   {loc: new google.maps.LatLng (32.880746, -117.238288), category: 'Truck'},
   {loc: new google.maps.LatLng (32.881755, -117.235091), category: 'Truck'},
   {loc: new google.maps.LatLng (32.876998, -117.235048), category: 'Van'}
];
  item_data = ['All','Car','Truck'];
  
  var fNode = document.getElementById('filter');
  
  var notifyFunc = function(cat) {
      var oldMarkers = this.state.markers;
      var newMarkers = [];
      if (cat == 'All')
        return;
      for (var i = 0 ; i < oldMarkers.length ; i++) {
        if (oldMarkers[i].category == cat) {
          newMarkers.push(oldMarkers[i]);
        } else {
          oldMarkers[i].setMap(null);
          delete oldMarkers[i];
        }
      }
      
      this.setState({markers:newMarkers});
  };
  
  
  
  ref = React.render(React.createElement(MyGoogleMap, {locations:data,notify:notifyFunc}), mountNode);
  
  filterRef = React.render(React.createElement(MyFilterComponent,{items:item_data,map:ref}),document.getElementById('filter'));
  
  
  
  
  
  
  
  
  
  
  /*setInterval(function() {
    //console.log("interval running..");
      updateLocations();
    //console.log("interval done!");
     }, 150);*/
  
}

