var _ = require('underscore');
var React = require( 'react' );
var classnames = require( 'classnames' );


var ga;


var navItems = [
	{
		text: 'ENTER THE ANDYs NOW',
		href: 'https://www.andyawards.com/enter-now/',
		className: 'enter',
		trackingName: 'header enter now'
	},
	{
		text: '',
		href: 'https://twitter.com/andyawards',
		className: 'icon icon-twitter',
		trackingName: 'header twitter'
	},
	{
		text: '',
		href: 'https://www.facebook.com/pages/The-International-ANDY-Awards/173551691137',
		className: 'icon icon-facebook',
		trackingName: 'header facebook'
	},
	{
		text: '',
		href: 'https://www.linkedin.com/groups/International-ANDY-Awards-1867856/about',
		className: 'icon icon-linkedin',
		trackingName: 'header linkedin'
	},
	{
		text: '',
		href: 'http://instagram.com/andyawards',
		className: 'icon icon-instagram',
		trackingName: 'header instagram'
	}
];


var Header = React.createClass( {displayName: "Header",

	getInitialState: function() {

		return {
			compact: false
		};
	},

	componentDidMount: function() {

		ga = require( 'react-ga' );

		this.$window = $(window);
		this.breakpointY = 0;

		$(window)
			.on('scroll', this.onPageScroll)
			.on('resize', this.resize);

		this.resize();
	},

	createNavItem: function(item, index) {

		return (
			React.createElement("li", {key: index}, 
				React.createElement("a", {href: item.href, target: "_blank", className: item.className, onClick: this.track.bind(this, item)}, 
					React.createElement("span", {className: item.className}, item.text), 
					React.createElement("span", {className: 'after ' + item.className}, item.text)
				)
			)
		);
	},

	track: function(item) {

		ga.event( {
			category: item.trackingName,
			action: 'click',
			nonInteraction: false
		} );
	},	

	resize: function() {

		this.breakpointY = this.$window.height() / 2;
	},

	onPageScroll: function() {

		if( this.$window.scrollTop() > this.breakpointY ) {

			if(!this.state.compact) {

				this.setState({
					compact: true
				});
			}

		}else if( this.state.compact ) {

				this.setState({
					compact: false
				});
		}
	},

	render: function() {

		var headerClassName = classnames({
			'compact': this.state.compact
		});

		return (
			React.createElement("header", {className: headerClassName}, 
				
				React.createElement("a", {className: "logo", href: "https://www.andyawards.com/", target: "_blank"}), 
				
				React.createElement("div", {className: "inner"}, 

					React.createElement("nav", null, 
						React.createElement("ul", null, 
						  _.map(navItems, this.createNavItem)
						)
					)
					
				)

			)
		);
	}
} );


module.exports = Header;