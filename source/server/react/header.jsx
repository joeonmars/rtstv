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
	}
];

var Header = React.createClass( {

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
			<li key={index} className={itemClassName}>
				<a href={itemURL}>{item.text}</a>
			</li>
		);
	},

	render: function() {

		var headerClassName = classnames({
			'compact': this.state.compact
		});

		return (
			<header className={headerClassName}>
				<div className='inner'>
					<a className='logo' href='/'>Reuters TV</a>

					<nav>
						<ul>
						{items.map(this.renderNavItem)}
						</ul>
					</nav>
				</div>
			</header>
		);
	}
});


module.exports = Header;