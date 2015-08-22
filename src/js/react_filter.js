var MyDropMenu = React.createClass({displayName:"MyFilterComponent",
    getInitialState: function() {
      return {filter:'All'};
    },
    render: function() {
      var createOption = function(item,idx) {
        return React.createElement('option',{value:item},item);
      }
      return (
      React.createElement('div',null,
      React.createElement('h5',null,this.props.title), 
      React.createElement('select',null,this.props.items.map(createOption,this))
      )
      )
    }
});