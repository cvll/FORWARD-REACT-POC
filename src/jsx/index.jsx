var Hello = React.createClass({
    render: function() {
        return <div>GoodBye {this.props.name}</div>;
    }
});
 
React.render(<Hello name="World" />, document.getElementById('container'));

