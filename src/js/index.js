// DOM references
var appNode = document.getElementById('app');

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
      var res = {};
      
      for (var i = 0 ; i < this.props.data.length ; i++) {
        var curr = this.state.data[i];
        var obj = {};
        obj.loc = curr.loc;
        if ((curr.type == this.state.filter[FILTERS.TYPE] || this.state.filter[FILTERS.TYPE] == 'All') &&
            (curr.size == this.state.filter[FILTERS.SIZE] || this.state.filter[FILTERS.SIZE] == 'All' ) &&
             curr.weight >= this.state.filter[FILTERS.WEIGHT]) {
               obj.visibility = true;
              this.state.data[i].visibility = true;
        } else {
              obj.visibility = false;
              this.state.data[i].visibility = false;
        }
        res[curr.id] = obj;
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

var init = function() {
  ORIGINAL_DATA = randomData();
  // Creates the app
  appReference = React.render(React.createElement(app,{data: ORIGINAL_DATA,items:[CAR_TYPES,CAR_SIZE,CAR_WEIGHT]}),appNode);
    
    
    // Constantly updates locations of ORIGINAL_DATA  
    setInterval(function() {
      updateLocations();
     }, 150);
}
  
  
  
  
  

  


