// DOM references
var mapNode = document.getElementById('map');
var filterNode = document.getElementById('filter');

// Reference to React objects
var reactMapReference;
var reactFilterReference;

var app = React.createClass({displayName:"app",
    getInitialState: function() {
      return {map:null};
    },
    onChange: function() {

    },
    transformLocations: function() {
      var res = [];
      for (var i = 0 ; i < this.props.data.length ; i++) {
        res.push(this.props.data[i].loc);
      }
      return res;
    },
    createMap: function() {
      //this.state.map.createMap();
    },
    render: function() {
      this.state.map = React.createElement(MyGoogleMap,{container_node: this.props.node,locations: this.transformLocations()})
      return (
        React.createElement('div',{className:'app'},
          React.createElement(MyDropMenu,{items:this.props.items[0],title:'Car Type'}),
          React.createElement(MyDropMenu,{items:this.props.items[1],title:'Car Size'}),
          React.createElement(MyDropMenu,{items:this.props.items[2],title:'Minimum Car Weight'}),
          this.state.map
        )
        
      )
    }
});
var init = function() {


  // Ideally placed in vdb.js. For simplicity I placed it here as the object requires the google maps api to load first.
  ORIGINAL_DATA = [
   {loc: new google.maps.LatLng (32.879632,-117.235687), type: 'Car',size:'small',weight:50},
   {loc: new google.maps.LatLng (32.882206, -117.229898), type: 'Car',size:'large',weight:600},
   {loc: new google.maps.LatLng (32.880746, -117.238288), type: 'Truck',size:'medium',weight:350},
   {loc: new google.maps.LatLng (32.881755, -117.235091), type: 'Truck',size: 'large', weight: 1000},
   {loc: new google.maps.LatLng (32.876998, -117.235048), type: 'Van', size:'large',weight: 830}
  ];
    var p = React.render(React.createElement(app,{node: mapNode,data: ORIGINAL_DATA,items:[CAR_TYPES,CAR_SIZE,CAR_WEIGHT]}),mapNode);
/*
  reactMapReference = React.render(React.createElement(MyGoogleMap, {locations:ORIGINAL_DATA,notify:notifyFunc}), mapNode);
  reactFilterReference = React.render(React.createElement(MyFilterComponent,{items:CATEGORIES,map:reactMapReference}),filterNode);
  */
  p.createMap();
}
  
  
  
  
  

  


