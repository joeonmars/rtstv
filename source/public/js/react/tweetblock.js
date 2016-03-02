var React = require( 'react' );
var ReactDOM = require( 'react-dom' );
var classnames = require( 'classnames' );
var BaseBlock = require( './baseblock' );
var ShineCanvas = require( './fx/shinecanvas' );
var Input = require( './input' );
var Utils = require( '../helpers/utils' );
var urlValidator = require( '../helpers/urlvalidator' );

var tweetFormatter;


var TweetBlock = React.createClass( {displayName: "TweetBlock",

	mixins: [ BaseBlock.getMixins() ],

	getDefaultProps: function() {

		return {
			type: 'tweet',
			useCanvas: ShineCanvas.shouldUseGL()
		}
	},

	getInitialState: function() {

		return {
			tweetText: this.props.cache || '',
			formattedTweet: ''
		}
	},

	componentDidMount: function() {

		tweetFormatter = require( 'tweet-formatter' );

		if(!this.state.tweetText) {

			this.updateTweet( this.state.content );

		}else {

			this.setState({
				formattedTweet: this.formatTweet( this.state.tweetText ),
				loaded: true
			});
		}
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

		if ( prevState.tweetText !== this.state.tweetText ) {
			this.cacheSubmissionToServer( this.state.tweetText );
		}
	},

	formatTweet: function(text) {

		return tweetFormatter( text ).replace(/<a/g, '<a target="_blank"');
	},

	updateTweet: function( url ) {

		var tweetId = urlValidator.matchTweetURL( url ).id;

		var endpoint = global.config.SERVER_URL + '/tweet/' + tweetId;

		var xhr = $.get( endpoint, function(data) {

			this.setState( {
				loaded: true,
				tweetText: data[ 'text' ],
				formattedTweet: this.formatTweet( data[ 'text' ] )
			} );

		}.bind(this) );

		return xhr;
	},

	validateTempContent: function() {

		// validate url
		var result = urlValidator.matchTweetURL( this.state.tempContent );

		if(!result) {
			this.setValidationResult( null, 'invalid' );
			return;
		}
		
		// validate response
		var formattedContent = urlValidator.formatTweetURL( result );

		this.updateTweet( formattedContent ).done(function() {

			this.setValidationResult( formattedContent );

		}.bind(this)).fail(function() {

			this.setValidationResult( null, 'private' );

		}.bind(this));
	},

	render: function() {

		var _editInput = (
			React.createElement("form", {onSubmit: this.confirmEdit}, 
				React.createElement(Input, {ref: "input", placeholder: "ADD A TWEET URL", 
					editable: this.state.inEdit, html: this.getCurrentContent(), onChange: this.setTempContent})
			)
		);

		var background = this.props.useCanvas ? (
			React.createElement(ShineCanvas, {color: "gold"})
		) : null;

		var contentClassname = classnames('content', {
			'use-canvas': this.props.useCanvas
		});

		return (
			React.createElement(BaseBlock, {
				type: this.props.type, 
				contentEmptied: this.state.contentEmptied, 
				inEdit: this.state.inEdit, loaded: this.state.loaded, liked: this.state.liked, 
				editInput: _editInput, errorMessage: this.state.errorMessage, 
				toggleEdit: this.toggleEdit, confirmEdit: this.confirmEdit, cancelEdit: this.cancelEdit, 
				onClickShare: this.onClickShare, onLiked: this.onLiked}, 

				React.createElement("div", {className: contentClassname}, 
					background, 
					React.createElement("article", null, 
						React.createElement("div", {className: "icon icon-twitter"}), 
						React.createElement("p", {dangerouslySetInnerHTML: {__html: this.state.formattedTweet}})
					)
				)
			
			)
		);
	}
} );

module.exports = TweetBlock;