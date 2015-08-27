// DOM references
var mapNode = document.getElementById('map');
var filterNode = document.getElementById('filter');


var FILTERS = {
  TYPE: 0,
  SIZE: 1,
  WEIGHT:2
};

// Reference to React objects
var appReference;

var app = React.createClass({displayName:"app",
    getInitialState: function() {
      // initial visibility is show all
      for (var i = 0 ; i < this.props.data.length ; i++) {
        this.props.data[i].visibility = true;
      }
      
      return {
                data:this.props.data,
                filter:['All','All',0],
                map:null
              };
    },
    // This function is passed to filter objects to notify the app of filter (drop-down) changes.
    onChange: function(i,data) {
      var tmp = this.state.filter;
      tmp[i] = data;
      this.setState({filters:tmp});
    },
    // From the knowledge of the app, provides necessary info for map
    getMapData: function() {
      var res = [];
      
      for (var i = 0 ; i < this.props.data.length ; i++) {
        var curr = this.state.data[i];
        if ((curr.type == this.state.filter[FILTERS.TYPE] || this.state.filter[FILTERS.TYPE] == 'All') &&
            (curr.size == this.state.filter[FILTERS.SIZE] || this.state.filter[FILTERS.SIZE] == 'All' ) &&
             curr.weight >= this.state.filter[FILTERS.WEIGHT]) {
          res.push(curr.loc);
          this.state.data[i].visibility = true;
        } else {
          this.state.data[i].visibility = false;
        }
      }
      return res;
    },
    // Triggered on new props, just updates state
    componentWillReceiveProps: function(nextProps) {
      this.setState({data:nextProps.data});
    },
    // From knowledge of the app, provides necessary info for table
    getTableData: function() {
      var res = [{id:'Id',loc:'Location',type:'Type',size:'Size',weight:'Weight',visibility:'Visibility'}]
      for (var i = 0 ; i < this.state.data.length ; i++) {
        if (this.state.data[i].visibility)
          res.push(this.state.data[i])
      }
      
      return res;
    },
    render: function() {
      // Must render map first to provide a reference
      return (
        React.createElement('div',{className:'app'},
          React.createElement(MyDropMenu,{filter_idx:FILTERS.TYPE,onChange:this.onChange,items:this.props.items[FILTERS.TYPE],title:'Car Type'}),
          React.createElement(MyDropMenu,{filter_idx:FILTERS.SIZE,onChange:this.onChange,items:this.props.items[FILTERS.SIZE],title:'Car Size'}),
          React.createElement(MyDropMenu,{filter_idx:FILTERS.WEIGHT,onChange:this.onChange,items:this.props.items[FILTERS.WEIGHT],title:'Minimum Car Weight'}),
          React.createElement(MyGoogleMap,{locations: this.getMapData()}),
          React.createElement(MyTable,{data:this.getTableData()})
        )
        
      )
    }
});



// Function used to randomly move the locations to simulate live data
var updateLocations = function() {
  var curr_data = ORIGINAL_DATA;
      for (var i = 0 ; i < curr_data.length ; i++) { 
        var lat = curr_data[i].loc.lat() + (Math.random()/1000);
        var lng = curr_data[i].loc.lng() + (Math.random()/1000);
        var newLoc = new google.maps.LatLng(lat.toFixed(6),lng.toFixed(6));
        ORIGINAL_DATA[i].loc = newLoc;
      } 
      
      // setProps triggers the chain to re-render (or update) the app
      appReference.setProps({data: ORIGINAL_DATA});
}


var init = function() {
  // Ideally placed in vdb.js. For simplicity I placed it here as the object requires the google maps api to load first.
  ORIGINAL_DATA = [
   {id:0,loc: new google.maps.LatLng (32.879632,-117.235687), type: 'Car',size:'Small',weight:50},
   {id:1,loc: new google.maps.LatLng (32.882206, -117.229898), type: 'Car',size:'Large',weight:600},
   {id:2,loc: new google.maps.LatLng (32.880746, -117.238288), type: 'Truck',size:'Medium',weight:350},
   {id:3,loc: new google.maps.LatLng (32.881755, -117.235091), type: 'Truck',size: 'Large', weight: 1000},
   {id:4,loc: new google.maps.LatLng (32.876998, -117.235048), type: 'Van', size:'Large',weight: 830}
  ];

  // Creates the app
  appReference = React.render(React.createElement(app,{data: ORIGINAL_DATA,items:[CAR_TYPES,CAR_SIZE,CAR_WEIGHT]}),mapNode);
    
    
    // Constantly updates locations of ORIGINAL_DATA  
    setInterval(function() {
      updateLocations();
     }, 150);
}
  
  
  
  
  

  


