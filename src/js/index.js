// DOM references
var appNode = document.getElementById('app');

// Reference to React objects
var appReference;

var template = "{\"id\":20,\n \"loc\": {\"lat\" : 32.88219705710263 ,\"lng\" : -117.22989883478147},\n \"type\": \"Car\" ,\n \"size\": \"Medium\",\n \"color\": \"Red\", \n  \"visibility\": true \n}";

var app = React.createClass({displayName:"app",
    getInitialState: function() {
      // initial visibility is show all
      for (var i = 0 ; i < this.props.data.length ; i++) {
        this.props.data[i].visibility = true;
      }
      
      return {
                data:this.props.data,
                filter:['All','All','All'],
                mapData: {},
                tableData: [{id:'Id',loc:'Location',type:'Type',size:'Size',color:'Color',visibility:'Visibility'}],
                activeMarker: null,
              };
    },
    // This function is passed to filter objects to notify the app of filter (drop-down) changes.
    onChange: function(i,data) {
      
      this.state.filter[i.slice(1,i.length)] = data;
      this.handleUpdate(this.state.data);
    },
    // From the knowledge of the app, provides necessary info for map
    getMapData: function() {
      return this.state.mapData;
    },
    getTableData: function() {
      return this.state.tableData;
    },
    generateMapObj: function(obj) {
      var mapObj = {};
      mapObj.id = obj.id;
      //mapObj.type = obj.type;
      if (obj.loc) {
        mapObj.loc = obj.loc;
      }
      
      if (obj.visibility != null) {
        mapObj.visibility = obj.visibility;
      }
      
      return mapObj;
    },
    generateTblObj: function(obj) {
      return obj;
    },
    generateMapData: function(new_data) {
      var res = {};
      for (var key in new_data) {
        if (new_data.hasOwnProperty(key)) {
          res[key] = this.generateMapObj(new_data[key]);
        }
      }
      return res; 
    },
    generateTblData: function(new_data) {
      var res = [{id:'Id',loc:'Location',type:'Type',size:'Size',color:'Color',visibility:'Visibility'}];
      
      for (var key in new_data) {
        if(new_data.hasOwnProperty(key)) {
          res.push(this.generateTblObj(new_data[key]));
        }
      }
      
      return res;
    },
    filter: function(data) {
      for (var key in data) {
        if(data.hasOwnProperty(key)) {
          if (
              (data[key].type == this.state.filter[FILTERS.TYPE] || (this.state.filter[FILTERS.TYPE] == 'All')) &&
              (data[key].size == this.state.filter[FILTERS.SIZE] || (this.state.filter[FILTERS.SIZE] == 'All')) &&
              (data[key].color == this.state.filter[FILTERS.COLOR] || (this.state.filter[FILTERS.COLOR] == 'All')))
              {
                data[key].visibility = true;    
              } else {
                data[key].visibility = false;
              }
          }
        }
    },
    handleUpdate: function(newData) {
      var state_data = this.state.data;
      
      // handle deletions
      for (var key in state_data) {
        if(state_data.hasOwnProperty(key)) {
          if (!newData[key]) {
            delete state_data[key];
          }
        }
      }
      
      // handle modifications + adds
      for (var key in newData) {
        if(newData.hasOwnProperty(key)) {
          state_data[key] = newData[key];
        }
      }
      
      this.filter(state_data);
      var mapData = this.generateMapData(state_data);
      var tblData = this.generateTblData(state_data);
      
      this.setState({data:state_data,mapData:mapData,tableData:tblData});
    },
    // Triggered on new props, just updates state
    componentWillReceiveProps: function(nextProps) {
      this.handleUpdate(nextProps.data);
    },
    componentWillMount: function() {
      this.handleUpdate(this.state.data);
    },
    
    /* UI Functions */
    addVehicle(data) {
      var obj = JSON.parse(data);
      if (this.state.data[obj.id]) {
        alert("Id " + obj.id + " already exists.");
      } else {
        obj.loc = new google.maps.LatLng(obj.loc.lat,obj.loc.lng);
        
        var new_state_data = this.state.data;
        new_state_data[obj.id] = obj;
        
        this.handleUpdate(new_state_data);
      }
    },
    deleteVehicle(id) {
      if (!this.state.data[id]) {
        alert("Id " + id + " does not exist");
      } else {
        var new_state_data = this.state.data;
        new_state_data[id] = null;
        
        this.handleUpdate(new_state_data);
      }
    },
    updateVehicle(data) {
      var obj = JSON.parse(data);
      
      if (!this.state.data[obj.id]) {
        alert("Id " + obj.id + " does not exist.");
      } else {
        obj.loc = new google.maps.LatLng(obj.loc.lat,obj.loc.lng);
        
        var new_state_data = this.state.data;
        new_state_data[obj.id] = obj;
        
        this.handleUpdate(new_state_data);
      }
    },
    pingVehicle(id) {
      if (!this.state.data[id]) {
        alert("Id " + id + " does not exist");
      } else {
        this.state.activeMarker = id;
        this.handleUpdate(this.state.data);
      }
    },
    render: function() {
      // Must render map first to provide a reference , 
      return (
        React.createElement('div',{id:'app',className:'app'},
          React.createElement(MyDropMenu,{id:"f" + FILTERS.TYPE,onChange:this.onChange,items:this.props.items[FILTERS.TYPE],title:'Car Type'}),
          React.createElement(MyDropMenu,{id:"f" + FILTERS.SIZE,onChange:this.onChange,items:this.props.items[FILTERS.SIZE],title:'Car Size'}),
          React.createElement(MyDropMenu,{id:"f" + FILTERS.COLOR,onChange:this.onChange,items:this.props.items[FILTERS.COLOR],title:'Car Color'}),
          React.createElement(MyInputComp,{id:"delete",onClick:this.deleteVehicle,inputText: "<id>",buttonText: "Delete It!"}),
          React.createElement(MyInputComp,{id:"add",json:true,onClick:this.addVehicle,inputText: template,buttonText: "Add It!"}),
          React.createElement(MyInputComp,{id:"ping",onClick:this.pingVehicle,inputText: "<id>",buttonText: "Ping It!"}),
          React.createElement(MyInputComp,{id:"update",json:true,onClick:this.updateVehicle,inputText: template,buttonText: "Update It!"}),
          React.createElement('div',{id:'dataVis'},
            React.createElement(MyGoogleMap,{ping:this.state.activeMarker,locations: this.getMapData()}),
            React.createElement(MyTable,{data:this.getTableData()}))
        )
      )
    }
});

var init = function() {
  ORIGINAL_DATA = randomData();
  // Creates the app
  appReference = React.render(React.createElement(app,{data: ORIGINAL_DATA,items:[CAR_TYPES,CAR_SIZE,CAR_COLOR]}),appNode);
    
    
    // Constantly updates locations of ORIGINAL_DATA  
    setInterval(function() {
      updateLocations();
     }, 3000);
}
  
  
  
  
  

  


