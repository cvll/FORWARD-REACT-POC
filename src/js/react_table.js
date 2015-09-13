var MyTable = React.createClass({displayName:"MyTable",
    getInitialState: function() {
      return {data: this.props.data};
    },
    componentWillReceiveProps: function(nextProps) {
      this.setState({data:nextProps.data});
    },
    render: function() {
        var createRow = function(item,idx) {
            return React.createElement(MyTableRow,{data:item})
        };
		return (
            React.createElement('table',{id: "tbl"},
                React.createElement('tbody',{},
                this.state.data.map(createRow,this)))
        )
    }
});

var MyTableRow = React.createClass({displayName:"MyTableRow",
    getInitialState: function() {
      return {data: this.props.data};
    },
    componentWillReceiveProps: function(nextProps) {
      this.setState({data:nextProps.data});
    },
    render: function() {
      var createTd = function(d) {
          var tds = [];
          
          //iterate through all keys of data to put in a row
          for (var key in d) {
            if (d.hasOwnProperty(key)) {
                tds.push(React.createElement('td',{},d[key].toString()));
            }
          }
          
          return tds;
      };
      return React.createElement('tr',{key:this.state.data.id,onChange:this.onChange},{children: createTd(this.state.data)});
    }
});
    