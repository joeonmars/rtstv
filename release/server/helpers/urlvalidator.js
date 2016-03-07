var UrlPattern = require( 'url-pattern' );
var Utils = require( './utils' );

var _instance;

var UrlValidator = function() {

	this.soundCloudPattern = new UrlPattern( '(http(s)\\://)(www.)soundcloud.com/:user(/sets)/:track(/*)' );
	this.instagramPattern = new UrlPattern( '(http(s)\\://)(www.)instagram.com/p/:shortcode(/*)' );
	this.flickrPattern = new UrlPattern( '(http(s)\\://)(www.)flickr.com/photos/:user/:id(/*)' );
	this.tweetPattern = new UrlPattern( '(http(s)\\://)twitter.com/:user/status/:id(/*)' );
	this.youTubePattern = new UrlPattern( '(http(s)\\://)(www.)youtube.com/watch?v=:id' );
};


UrlValidator.prototype.matchSoundCloudURL = function( url ) {

	return this.soundCloudPattern.match( url );
};


UrlValidator.prototype.matchInstagramURL = function( url ) {

	return this.instagramPattern.match( url );
};


UrlValidator.prototype.matchFlickrURL = function( url ) {

	return this.flickrPattern.match( url );
};


UrlValidator.prototype.matchTweetURL = function( url ) {

	return this.tweetPattern.match( url );
};


UrlValidator.prototype.matchYouTubeURL = function( url ) {

	return this.youTubePattern.match( url );
};


UrlValidator.prototype.formatTweetURL = function( params ) {

	var pattern = new UrlPattern( '/:user/status/:id' );
	var formatted = 'https://twitter.com' + pattern.stringify( params );

	return formatted;
};


UrlValidator.prototype.formatYouTubeURL = function( params ) {

	var pattern = new UrlPattern( '/watch?v=:id' );
	var formatted = 'https://www.youtube.com' + pattern.stringify( params );

	return formatted;
};


UrlValidator.prototype.formatInstagramURL = function( params ) {

	var pattern = new UrlPattern( '/p/:shortcode/' );
	var formatted = 'https://www.instagram.com' + pattern.stringify( params );

	return formatted;
};


UrlValidator.prototype.formatFlickrURL = function( params ) {

	var pattern = new UrlPattern( '/photos/:user/:id/' );
	var formatted = 'https://www.flickr.com' + pattern.stringify( params );

	return formatted;
};


module.exports = Utils.createSingletonNow( _instance, UrlValidator );