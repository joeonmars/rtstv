var React = require( 'react' );
var classnames = require( 'classnames' );


var GifItem = React.createClass( {displayName: "GifItem",

	getInitialState: function() {

		return {
			loaded: false
		};
	},

	componentDidMount: function() {

		this.$img = $('<img>').attr('src', this.props.url);

		this.$img.one('load', function() {

			this.setState({
				loaded: true
			});

		}.bind(this));
	},

	componentWillUnmount: function() {

		this.$img.off();
	},

	render: function() {

		var gifStyle = this.state.loaded ? {
			backgroundImage: 'url(' + this.props.url + ')'
		} : null;

		var gifClassName = classnames('gif', {
			'selected': this.props.selected,
			'loaded': this.state.loaded
		});

		return (
			React.createElement("li", null, 
				React.createElement("div", {className: "gif-container"}, 
					React.createElement("div", {className: gifClassName, style: gifStyle, 
						"data-url": this.props.url, 
						onClick: this.props.onClick})
				)
			)
		);
	}
} );

module.exports = GifItem;