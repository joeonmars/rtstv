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
		id: 'publishers',
		url: 'https://www.reuters.tv/publishers',
		text: 'Publishers'
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
	},
	{
		id: 'careers',
		url: 'https://www.reuters.tv/careers',
		text: 'Careers'
	}
];

var Header = React.createClass( {displayName: "Header",

	getDefaultProps: function() {
	    return {
	    	currentNavId: 'about'
	    };
	},

	renderNavItem: function( item, index ) {

		var isActive = (item.id === this.props.currentNavId);

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

		return (
			React.createElement("header", null, 
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