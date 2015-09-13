var MyDropMenu = React.createClass({displayName:"MyFilterComponent",
    getInitialState: function() {
      return {id: this.props.id,filter:'All'};
    },
    onChange: function() {
      var node = React.findDOMNode(this);
      this.props.onChange(this.state.id,node.childNodes[1].options[node.childNodes[1].selectedIndex].value);  
    },
    render: function() {
      var createOption = function(item,idx) {
        return React.createElement('option',{value:item},item);
      }
      return (
            React.createElement('div',{id:this.props.id},
                  React.createElement('h5',null,this.props.title), 
                  React.createElement('select',{onChange:this.onChange},this.props.items.map(createOption,this))
            )
      )
    }
});