// global requires
global.$ = require( 'jquery' );
global._ = require( 'underscore' );

require( 'jquery-mousewheel' )( global.$ );

require( 'libs/gsap/TweenMax' );
require( 'libs/gsap/plugins/ScrollToPlugin' );
require( 'libs/gsap/plugins/ThrowPropsPlugin' );

require( 'libs/sine-waves' );
require( 'libs/jquery.preload' );


// read global configuration from HTML JSON
var $configTag = $( '#config' ).remove();
global.config = JSON.parse( $configTag.html() );

var $propsTag = $( '#props' ).remove();
global.props = $propsTag.length ? JSON.parse( $propsTag.html() ) : {};


// initialize GA and tracks the first page view
var ga = require( 'react-ga' );
ga.initialize( 'UA-48930036-8', {
	debug: true
} );
ga.pageview( '/' );


// start client app
$( document ).ready( function() {

	console.log( "Client app start!" );

	var React = require( 'react' );
	var ReactDOM = require( 'react-dom' );

	switch ( document.body.getAttribute( 'data-page' ) ) {
		case 'main':
			var MainContent = require( 'views/maincontent' );
			var mainContent = React.createElement( MainContent, global.props );
			var mainContainer = $( '#main-container' ).get( 0 );
			ReactDOM.render( mainContent, mainContainer );

			var Header = require( 'views/header' );
			var header = React.createElement( Header );
			var headerContainer = $( '#header-container' ).get( 0 );
			ReactDOM.render( header, headerContainer );

			// Enable smooth scroll for non-IE desktop browsers
			var scrollController = require( 'controllers/scrollcontroller' );
			if ( scrollController.canSmoothScroll ) {
				scrollController.enableSmoothScroll();
			}

			// Enable fastclick for mobile 
			if ( global.props.mobile ) {
				var attachFastClick = require( 'fastclick' );
				attachFastClick( document.body );
			}
			break;

		case 'share':
			var redirectUrl = global.props[ 'sharingInfo' ][ 'redirectUrl' ];
			window.location.href = redirectUrl;
			break;

		case 'error':

			break;

		case 'data':
			var DataTable = require( 'views/datatable' );
			var dataTable = React.createElement( DataTable, global.props );
			var dataContainer = $( '#data-container' ).get( 0 );
			ReactDOM.render( dataTable, dataContainer );
			break;

		default:
			break;
	}
} );