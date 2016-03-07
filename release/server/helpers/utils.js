var _ = require( 'underscore' );

var Utils = {};

Utils.transformPropsToJSON = function( props ) {

	var obj = _.omit( props, 'children' );

	var str = JSON.stringify( obj );
	return str;
};

Utils.nullFunction = function() {
	return undefined;
};


Utils.isDefAndNotNull = function( val ) {
	return val != null;
};


Utils.removeTags = function( body ) {
	var regex = /(&nbsp;|<([^>]+)>)/ig;
	return body.replace( regex, '' );
};


Utils.padDigits = function( number, digits ) {
	return Array( Math.max( digits - String( number ).length + 1, 0 ) ).join( 0 ) + number;
};


Utils.lerp = function( a, b, x ) {
	return a + x * ( b - a );
};


Utils.randomInt = function( a ) {
	return Math.floor( Math.random() * a );
};


Utils.uniformRandom = function( a, b ) {
	return a + Math.random() * ( b - a );
};


Utils.clamp = function( value, min, max ) {
	return Math.min( Math.max( value, min ), max );
};


Utils.selectElementContents = function( el ) {

	if ( el.tagName === 'INPUT' ) {

		el.setSelectionRange( 0, el.value.length );
		return;
	}

	var range = document.createRange();
	range.selectNodeContents( el );

	var sel = Utils.deselectElementContents();
	sel.addRange( range );
};


Utils.deselectElementContents = function() {

	var sel = window.getSelection();
	sel.removeAllRanges();

	return sel;
};


Utils.createSingleton = function( _instance, _constructor, _opt_window_instance_name ) {

	var func = function() {

		_instance = _instance || new _constructor();

		if ( _opt_window_instance_name ) {
			window[ _opt_window_instance_name ] = _instance;
		}

		return _instance;
	}

	return func;
};


Utils.createSingletonNow = function( _instance, _constructor, _opt_window_instance_name ) {

	return Utils.createSingleton( _instance, _constructor, _opt_window_instance_name )();
};


Utils.supportWebGL = function() {

	var canvas = document.createElement( 'canvas' );
	var gl, glExperimental = false;

	try {
		gl = canvas.getContext( "webgl" );
	} catch ( x ) {
		gl = null;
	}

	if ( gl === null ) {
		try {
			gl = canvas.getContext( "experimental-webgl" );
			glExperimental = true;
		} catch ( x ) {
			gl = null;
		}
	}

	if ( gl ) {
		return true;
	} else if ( "WebGLRenderingContext" in window ) {
		return true;
	} else {
		return false;
	}
};


module.exports = Utils;