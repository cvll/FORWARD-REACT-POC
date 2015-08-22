// DOM references
var mapNode = document.getElementById('map');
var filterNode = document.getElementById('filter');

var TYPE_FILTER = 0;
var SIZE_FILTER = 1;
var WEIGHT_FILTER = 2;
// Reference to React objects
var reactMapReference;
var reactFilterReference;
var appReference;

var app = React.createClass({displayName:"app",
    getInitialState: function() {
      for (var i = 0 ; i < this.props.data.length ; i++) {
        this.props.data[i].visibility = true;
      }
      return {
                data:this.props.data,
                filter:['All','All',0],
                map:null
              };
    },
    onChange: function(i,data) {
      var tmp = this.state.filter;
      tmp[i] = data;
      this.setState({filters:tmp});
    },
    updateLocation: function(i,loc) {
      this.updateLocation(i,loc);
    },
    transformData: function(data) {
      for (var i = 0; i < data.length ; i++) {
        data[i].visibility = this.state.data[i].visibility;
      }
      return data;
    },
    filterLocations: function() {
      var res = [];
      
      for (var i = 0 ; i < this.props.data.length ; i++) {
        var curr = this.state.data[i];
        if ((curr.type == this.state.filter[TYPE_FILTER] || this.state.filter[TYPE_FILTER] == 'All') &&
            (curr.size == this.state.filter[SIZE_FILTER] || this.state.filter[SIZE_FILTER] == 'All' ) &&
             curr.weight >= this.state.filter[WEIGHT_FILTER]) {
          res.push(curr.loc);
          curr.visibility = true;
        } else {
          curr.visibility = false;
        }
      }
      return res;
    },
    componentWillReceiveProps: function(nextProps) {
      this.setState({data:this.transformData(nextProps.data)});
    },
    render: function() {
      var boundChange = function() {
        
      }
      this.state.map = React.createElement(
                          MyGoogleMap,
                            {update: this.updateLocation,
                             container_node: this.props.node,
                             locations: this.filterLocations()}
                       )
      return (
        React.createElement('div',{className:'app'},
          React.createElement(MyDropMenu,{filter_idx:TYPE_FILTER,onChange:this.onChange,items:this.props.items[0],title:'Car Type'}),
          React.createElement(MyDropMenu,{filter_idx:SIZE_FILTER,onChange:this.onChange,items:this.props.items[1],title:'Car Size'}),
          React.createElement(MyDropMenu,{filter_idx:WEIGHT_FILTER,onChange:this.onChange,items:this.props.items[2],title:'Minimum Car Weight'}),
          this.state.map
        )
        
      )
    }
});



var updateLocations = function() {
  var curr_data = ORIGINAL_DATA;
      for (var i = 0 ; i < curr_data.length ; i++) { 
        var lat = curr_data[i].loc.lat() + (Math.random()/1000);
        var lng = curr_data[i].loc.lng() + (Math.random()/1000);
        var newLoc = new google.maps.LatLng(lat.toFixed(6),lng.toFixed(6));
        //appReference.updateLocation(i,newLoc);
        ORIGINAL_DATA[i].loc = newLoc;
      } 
      
      appReference.setProps({data: ORIGINAL_DATA});
}


var init = function() {


  // Ideally placed in vdb.js. For simplicity I placed it here as the object requires the google maps api to load first.
  ORIGINAL_DATA = [
   {loc: new google.maps.LatLng (32.879632,-117.235687), type: 'Car',size:'Small',weight:50},
   {loc: new google.maps.LatLng (32.882206, -117.229898), type: 'Car',size:'Large',weight:600},
   {loc: new google.maps.LatLng (32.880746, -117.238288), type: 'Truck',size:'Medium',weight:350},
   {loc: new google.maps.LatLng (32.881755, -117.235091), type: 'Truck',size: 'Large', weight: 1000},
   {loc: new google.maps.LatLng (32.876998, -117.235048), type: 'Van', size:'Large',weight: 830}
  ];
    appReference = React.render(React.createElement(app,{data: ORIGINAL_DATA,items:[CAR_TYPES,CAR_SIZE,CAR_WEIGHT]}),mapNode);
    
    setInterval(function() {
      updateLocations();
     }, 3000);
    
    
/*
  reactMapReference = React.render(React.createElement(MyGoogleMap, {locations:ORIGINAL_DATA,notify:notifyFunc}), mapNode);
  reactFilterReference = React.render(React.createElement(MyFilterComponent,{items:CATEGORIES,map:reactMapReference}),filterNode);
  */
}
  
  
  
  
  

  


