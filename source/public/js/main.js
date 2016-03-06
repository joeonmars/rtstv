// global requires
global.$ = require( 'jquery' );
global._ = require( 'underscore' );

require( 'jquery-mousewheel' )( global.$ );

require( 'libs/gsap/TweenMax' );
require( 'libs/gsap/plugins/ScrollToPlugin' );

require( 'libs/jquery.preload' );


// read global configuration from HTML JSON
var $propsTag = $( '#props' ).remove();
global.props = $propsTag.length ? JSON.parse( $propsTag.html() ) : {};


// start client app
$( document ).ready( function() {

	console.log( "Client app start!" );

	// Set global props
	global.mobile = $( 'html' ).attr( 'data-mobile' );

	// Initialize React
	var React = require( 'react' );
	var ReactDOM = require( 'react-dom' );

	var MainContent = require( 'views/maincontent' );
	var mainContent = React.createElement( MainContent, global.props.cmsData );
	var mainContainer = $( '#main-container' ).get( 0 );
	ReactDOM.render( mainContent, mainContainer );

	var Header = require( 'views/header' );
	var header = React.createElement( Header, global.props );
	var mainHeader = $( '#main-header' ).get( 0 );
	ReactDOM.render( header, mainHeader );

	// Enable fastclick for mobile 
	if ( global.mobile ) {
		var attachFastClick = require( 'fastclick' );
		attachFastClick( document.body );
	}
} );