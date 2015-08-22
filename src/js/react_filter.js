var MyDropMenu = React.createClass({displayName:"MyFilterComponent",
    getInitialState: function() {
      return {filter_idx:this.props.filter_idx,filter:'All'};
    },
    onChange: function() {
      var node = React.findDOMNode(this);
      this.props.onChange(this.state.filter_idx,node.childNodes[1].options[node.childNodes[1].selectedIndex].value);  
    },
    render: function() {
      var createOption = function(item,idx) {
        return React.createElement('option',{value:item},item);
      }
      return (
      React.createElement('div',null,
      React.createElement('h5',null,this.props.title), 
      React.createElement('select',{onChange:this.onChange},this.props.items.map(createOption,this))
      )
      )
    }
});