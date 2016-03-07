var React = require( 'react' );
var classnames = require('classnames');

var items = [
	{
		id: 'about',
		url: 'https://www.reuters.tv/about',
		text: 'About'
	},
	{
		id: 'advertise',
		url: 'https://www.reuters.tv/advertise',
		text: 'Advertise'
	},
	{
		id: 'press',
		url: 'https://www.reuters.tv/press',
		text: 'Press'
	},
	{
		id: 'reception',
		url: 'https://www.reuters.tv/reception',
		text: 'Reception'
	}
];

var Header = React.createClass( {displayName: "Header",

	getDefaultProps: function() {
	    return {
	    	pageId: 'about'
	    };
	},

	getInitialState: function() {
	    return {
	    	compact: false
	    };
	},

	componentDidMount: function() {

		$(window).scroll( this.onPageScroll );
	},

	onPageScroll: function() {

		var compact = ($(window).scrollTop() > window.innerHeight * .1);

		this.setState({
			compact: compact
		});
	},

	renderNavItem: function( item, index ) {

		var isActive = (item.id === this.props.pageId);

		var itemClassName = classnames({
			'active': isActive
		});

		var itemURL = isActive ? '/' : item.url;

		return (
			React.createElement("li", {key: index, className: itemClassName}, 
				React.createElement("a", {href: itemURL}, item.text)
			)
		);
	},

	render: function() {

		var headerClassName = classnames({
			'compact': this.state.compact
		});

		return (
			React.createElement("header", {className: headerClassName}, 
				React.createElement("div", {className: "inner"}, 
					React.createElement("a", {className: "logo", href: "/"}, "Reuters TV"), 

					React.createElement("nav", null, 
						React.createElement("ul", null, 
						items.map(this.renderNavItem)
						)
					)
				)
			)
		);
	}
});


module.exports = Header;