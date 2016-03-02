var React = require( 'react' );
var ReactDOM = require( 'react-dom' );
var moment = require('moment');
var BaseBlock = require( './baseblock' );
var Input = require( './input' );
var Utils = require( '../helpers/utils' );
var urlValidator = require( '../helpers/urlvalidator' );


var ImageBlock = React.createClass( {displayName: "ImageBlock",

	mixins: [ BaseBlock.getMixins() ],

	getDefaultProps: function() {

		return {
			type: 'image'
		};
	},

	getInitialState: function() {

		return {
			imageUrl: this.props.cache || ''
		};
	},

	componentDidUpdate: function( prevProps, prevState ) {

		if ( prevState.inEdit !== this.state.inEdit ) {

			if ( this.state.inEdit ) {

				this.refs.input.highlight();

			} else {

				this.refs.input.unhighlight();
			}
		}

		if ( prevState.content !== this.state.content ) {
			this.trackEdit();
		}

		if ( prevState.imageUrl !== this.state.imageUrl ) {
			this.cacheSubmissionToServer( this.state.imageUrl );
		}
	},

	handleAnimatedIn: function() {

		if(!this.state.imageUrl) {
			
			this.updateImage( this.state.content );

		}else {

			this.setState({
				loaded: true
			});
		}
	},

	updateImage: function( url ) {

		var fromInstagram = ( url.indexOf( 'instagram.com' ) > -1 );
		var fromFlickr = ( url.indexOf( 'flickr.com' ) > -1 );

		var endpoint;

		if ( fromInstagram ) {

			var shortcode = urlValidator.matchInstagramURL( url ).shortcode;
			endpoint = global.config.SERVER_URL + '/instagram/' + shortcode;
		}

		if ( fromFlickr ) {

			var id = urlValidator.matchFlickrURL( url ).id;
			endpoint = global.config.SERVER_URL + '/flickr/' + id;
		}

		var self = this;

		var xhr = $.get( endpoint, function(data) {

			var source = data[ 'source' ];
			var url = data[ 'url' ];
			var imageUrl = ( source && url ) ? source : url;

			$('<img>').attr('src', imageUrl).one('load', function() {

				self.setState( {
					loaded: true,
					imageUrl: imageUrl
				} );
			});

		} );

		return xhr;
	},

	validateTempContent: function() {

		// validate url
		var url = this.state.tempContent;
		var fromInstagram = ( url.indexOf( 'instagram.com' ) > -1 );
		var fromFlickr = ( url.indexOf( 'flickr.com' ) > -1 );

		var result;

		if(fromInstagram) {

			result = urlValidator.matchInstagramURL( url );

		}else if(fromFlickr) {

			result = urlValidator.matchFlickrURL( url );
		}

		if(!result) {
			this.setValidationResult( null, 'invalid' );
			return;
		}
		
		// validate response
		var formattedContent;

		if(result.shortcode) {

			formattedContent = urlValidator.formatInstagramURL( result );

		}else {

			formattedContent = urlValidator.formatFlickrURL( result );
		}

		this.updateImage( formattedContent ).done(function() {

			this.setValidationResult( formattedContent );

		}.bind(this)).fail(function() {

			this.setValidationResult( null, 'private' );

		}.bind(this));
	},

	render: function() {

		var contentStyle = {
			backgroundImage: this.state.imageUrl.length > 0 ? 'url(' + this.state.imageUrl + ')' : null
		};

		var _editInput = (
			React.createElement("form", {onSubmit: this.confirmEdit}, 
				React.createElement(Input, {ref: "input", placeholder: "ADD AN INSTAGRAM URL", 
					editable: this.state.inEdit, html: this.getCurrentContent(), onChange: this.setTempContent})
			)
		);

		return (
			React.createElement(BaseBlock, {
				type: this.props.type, 
				contentEmptied: this.state.contentEmptied, 
				inEdit: this.state.inEdit, loaded: this.state.loaded, liked: this.state.liked, 
				editInput: _editInput, errorMessage: this.state.errorMessage, 
				handleAnimatedIn: this.handleAnimatedIn, 
				toggleEdit: this.toggleEdit, confirmEdit: this.confirmEdit, cancelEdit: this.cancelEdit, 
				onClickShare: this.onClickShare, onLiked: this.onLiked}, 

				React.createElement("div", {className: "content", style: contentStyle})

			)
		);
	}
} );

module.exports = ImageBlock;