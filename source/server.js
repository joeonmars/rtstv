var _ = require( 'underscore' );
var path = require( 'path' );
var cookieParser = require( 'cookie-parser' );
var express = require( 'express' );
var favicon = require( 'serve-favicon' );
var routes = require( './server/routes' );

// parse params
var argv = require( 'optimist' )
	.default( {
		reseed: 'false'
	} )
	.argv;

// configure app
var app = express();

app.set( 'views', path.join( __dirname, 'server/react' ) );
app.set( 'view engine', 'jsx' );
app.engine( 'jsx', require( 'express-react-views' ).createEngine( {
	beautify: true
} ) );

app.use( cookieParser() );

app.use( '/', express.static( path.join( __dirname, '/public' ) ) );

var _favicon = favicon( 'public/images/misc/favicon.ico' );
app.use( _favicon );

// client routes
app.get( '/', routes.index );


// start listening
var localPort = 3010;
var listeningPort = process.env.PORT || localPort;
var host = process.env.HOST || require( 'my-local-ip' )();
var port = process.env.PORT || listeningPort;

var onServerStart = function() {

	GLOBAL.SERVER_URL = 'http://' + host + ( port ? ':' + port : '' );

	console.log( 'Server started: ' + GLOBAL.SERVER_URL );
};

var server = app.listen( listeningPort, onServerStart );