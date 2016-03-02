var React = require( 'react' );
var ReactDOM = require( 'react-dom' );
var BaseBlock = require( './baseblock' );
var Input = require( './input' );
var YouTube = require( 'react-youtube' );
var Utils = require( '../helpers/utils' );
var DurationWatcher = require('./mixins/durationwatcher');
var pubSub = require( '../helpers/pubsub' );
var urlValidator = require( '../helpers/urlvalidator' );


var VideoBlock = React.createClass( {displayName: "VideoBlock",

	mixins: [ BaseBlock.getMixins(), DurationWatcher ],

	getDefaultProps: function() {

		return {
			type: 'video'
		};
	},

	getInitialState: function() {
		return {
			poster: this.props.cache || '',
			video: null,
			started: false,
			videoShown: false
		};
	},

	componentDidMount: function() {

		pubSub.anyMediaPlayed.add( this.onAnyMediaPlayed, this );
	},

	componentWillUnmount: function() {

		pubSub.anyMediaPlayed.remove( this.onAnyMediaPlayed, this );
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

		if ( prevState.poster !== this.state.poster ) {
			this.cacheSubmissionToServer( this.state.poster );
		}
	},

	handleAnimatedIn: function() {

		if(!this.state.poster) {

			this.updateAndDisplayPoster( this.state.content );

		}else {

			this.setState({
				loaded: true
			});
		}

		this.setState({
			videoShown: true
		});
	},

	updateAndDisplayPoster: function( url ) {

		var videoId = urlValidator.matchYouTubeURL( url ).id;

		var posterEndpoint = global.config.SERVER_URL + '/youtube/poster/' + videoId;

		var self = this;

		var xhr = $.get(posterEndpoint, function( posterUrl ) {

			$('<img>').attr('src', posterUrl).one('load', function() {

				self.setState( {
					loaded: true,
					poster: posterUrl
				} );
			});
		} );

		return xhr;
	},

	validateTempContent: function() {

		// validate url
		var result = urlValidator.matchYouTubeURL( this.state.tempContent );

		if(!result) {
			this.setValidationResult( null, 'invalid' );
			return;
		}
		
		// validate response
		var formattedContent = urlValidator.formatYouTubeURL( result );

		this.updateAndDisplayPoster( formattedContent ).done(function() {

			this.setValidationResult( formattedContent );

		}.bind(this)).fail(function() {

			this.setValidationResult( null, 'private' );

		}.bind(this));
	},

	playVideo: function() {

		if(this.state.player) {

			this.state.player.playVideo();
		}
	},

	onPlayerReady: function( e ) {

		this.setState( {
			player: e.target,
			started: false
		} );
	},

	onPlay: function( e ) {

		this.setState({
			started: true
		});

		pubSub.anyMediaPlayed.dispatch( this.state.player );

		this.startTrackingDuration( this.state.submissionId, 'video' );
	},

	onPause: function( e ) {

		this.stopTrackingDuration();
	},

	onEnd: function( e ) {

		this.stopTrackingDuration();
	},

	onAnyMediaPlayed: function( player ) {

		if ( !this.state.player || this.state.player === player ) {
			return;
		}

		if ( this.state.player.getPlayerState() === YT.PlayerState.PLAYING ) {

			this.state.player.pauseVideo();
		}
	},

	render: function() {

		// https://developers.google.com/youtube/player_parameters
		var opts = {
			playerVars: {
				autoplay: 0,
				controls: 0,
				showinfo: 0,
				fs: 0,
				iv_load_policy: 3,
				modestbranding: 1,
				rel: 0
			}
		};

		var _editInput = (
			React.createElement("form", {onSubmit: this.confirmEdit}, 
				React.createElement(Input, {ref: "input", placeholder: "ADD A YOUTUBE URL", 
					editable: this.state.inEdit, html: this.getCurrentContent(), onChange: this.setTempContent})
			)
		);

		var posterStyle = {
			backgroundImage: this.state.poster.length > 0 ? 'url(' + this.state.poster + ')' : 'none',
			display: this.state.started ? 'none' : 'block'
		};

		var youtubeVideo = this.state.videoShown ? (
			React.createElement(YouTube, {url: this.state.content, opts: opts, 
				onReady: this.onPlayerReady, onPlay: this.onPlay, onPause: this.onPause, onEnd: this.onEnd})
		) : null;

		return (
			React.createElement(BaseBlock, {
				type: this.props.type, 
				contentEmptied: this.state.contentEmptied, 
				inEdit: this.state.inEdit, loaded: this.state.loaded, liked: this.state.liked, 
				handleAnimatedIn: this.handleAnimatedIn, 
				editInput: _editInput, errorMessage: this.state.errorMessage, 
				toggleEdit: this.toggleEdit, confirmEdit: this.confirmEdit, cancelEdit: this.cancelEdit, 
				onClickShare: this.onClickShare, onLiked: this.onLiked}, 

				React.createElement("div", {className: "content"}, 
					youtubeVideo, 

					React.createElement("div", {className: "poster", style: posterStyle}, 
						React.createElement("button", {className: "icon icon-play-video", onClick: this.playVideo})
					)
				)

			)
		);
	}
} );

module.exports = VideoBlock;