var _ = require( 'underscore' );
var React = require( 'react' );
var ReactDOM = require( 'react-dom' );
var classnames = require( 'classnames' );
var Input = require( './input' );
var Utils = require( '../helpers/utils' );
var urlValidator = require( '../helpers/urlvalidator' );
var DurationWatcher = require('./mixins/durationwatcher');
var pubSub = require( '../helpers/pubsub' );
var BaseSection = require( './basesection' );
var ShineCanvas = require( './fx/shinecanvas' );
var AudioPulser = require( './fx/audiopulser' );


var FallbackSoundSection = React.createClass( {displayName: "FallbackSoundSection",

	mixins: [ DurationWatcher ],

	getDefaultProps: function() {

		return {
			useCanvasText: true
		};
	},

	getInitialState: function() {

		return {
			submissions: this.props.submissions,
			currentSubmission: null,
			paused: true,
			soundInfo: null
		};
	},

	componentDidMount: function() {

		// request all soundtracks info
		var self = this;

		_.each(this.state.submissions, function(submission, index) {

			self.requestTrackInfo( submission.content ).then(function(response) {

				self.onTrackRequestSucceed(response, submission._id);

			}, function(error) {

				self.onTrackRequestError(error, submission._id);
			});
		});

		//
		pubSub.nextSoundClicked.add( this.playNext, this );
		pubSub.prevSoundClicked.add( this.playPrev, this );
		pubSub.soundToggled.add( this.togglePlay, this );
	},

	componentDidUpdate: function( prevProps, prevState ) {

		if ( prevState.currentSubmission !== this.state.currentSubmission ) {

			this.stopTrackingDuration();

			this.loadTrack( this.state.currentSubmission['stream_url'] );

			var submission = this.state.currentSubmission;

			pubSub.soundChanged.dispatch( this.player, {
				index: _.indexOf(this.state.submissions, submission),
				total: this.state.submissions.length,
				title: submission['title'],
				username: submission['username'],
				duration: submission['duration'],
				image: submission['image']
			} );
		}

		if ( prevState.paused !== this.state.paused ) {

			if(this.state.paused) {
				this.pauseTrack();
			}else {
				this.playTrack();
			}
		}
	},

	loadTrack: function(streamUrl) {

		this.disposeTrack();

		this.player = new Audio();
		this.player.crossOrigin = 'anonymous';
		this.player.setAttribute( 'src', streamUrl );

		$( this.player )
			.on( 'play', this.onTrackPlay )
			.on( 'pause', this.onTrackPause )
			.on( 'ended', this.onTrackEnded );

		this.player.play();
	},

	disposeTrack: function() {

		if ( this.player ) {
			this.player.pause();
			$( this.player ).off();
		}
	},

	playTrack: function() {

		if ( this.player ) {

			this.player.play();
		}
	},

	pauseTrack: function() {

		if ( this.player ) {

			this.player.pause();
		}
	},

	togglePlay: function() {

		if( this.state.paused ) {
			this.playTrack();
		}else {
			this.pauseTrack();
		}
	},

	playPrev: function() {

		var submissions = this.state.submissions;
		var currentIndex = _.indexOf( submissions, this.state.currentSubmission );
		var prevSubmission = (currentIndex - 1 < 0 ? _.last(submissions) : submissions[currentIndex - 1]);

		this.setState({
			currentSubmission: prevSubmission
		});
	},

	playNext: function() {

		var submissions = this.state.submissions;
		var currentIndex = _.indexOf( submissions, this.state.currentSubmission );
		var nextSubmission = (currentIndex + 1 > submissions.length - 1 ? _.first(submissions) : submissions[currentIndex + 1]);

		this.setState({
			currentSubmission: nextSubmission
		});
	},

	onTrackPlay: function( e ) {

		this.setState({
			paused: false
		});

		pubSub.anyMediaPlayed.dispatch( this.player );

		this.refs.audioPulser.play();

		this.startTrackingDuration( this.state.currentSubmission._id, 'sound' );
	},

	onTrackPause: function( e ) {

		this.setState({
			paused: true
		});

		this.refs.audioPulser.pause();

		this.stopTrackingDuration();
	},

	onTrackEnded: function(e) {

		this.refs.audioPulser.pause();

		this.stopTrackingDuration();

		if(!global.props.mobile) {
			this.playNext();
		}
	},

	requestTrackInfo: function( url ) {

		var track = urlValidator.matchSoundCloudURL( url ).track;
		var endpoint = global.config.SERVER_URL + '/soundcloud/' + track;

		var promise = $.get( endpoint );
		return promise;
	},

	onTrackRequestSucceed: function(data, submissionId) {

		var oldSubmissionIndex = _.findIndex(this.state.submissions, {
			_id: submissionId
		});
		
		var oldSubmission = _.clone(this.state.submissions[ oldSubmissionIndex ]);

		_.extend(oldSubmission, {
			'stream_url': data['stream_url'] + '?client_id=' + data[ 'client_id' ],
			'title': data['title'],
			'username': data[ 'user' ][ 'username' ],
			'duration': data['duration'] / 1000,
			'image': data['artwork_url'] || data[ 'user' ][ 'avatar_url' ]
		});

		var submissions = this.state.submissions.concat();
		submissions[oldSubmissionIndex] = oldSubmission;

		this.setState({
			submissions: submissions
		});
	},

	onTrackRequestError: function(error, submissionId) {

		var oldSubmission = _.find(this.state.submissions, {
			_id: submissionId
		});

		var submissions = _.without( this.state.submissions, oldSubmission );

		this.setState({
			submissions: submissions
		});
	},

	createSoundItem: function( submission ) {

		var currentSubmission = this.state.currentSubmission;
		var isActive = (currentSubmission && currentSubmission._id === submission._id);

		var className = classnames({
			'active': isActive,
			'playing': (isActive && !this.state.paused)
		});

		var index = _.indexOf(this.state.submissions, submission);

		return (
			React.createElement("li", {key: submission._id, 
				className: className, 
				"data-id": submission._id}, 
				React.createElement("button", {className: "play-button", 
						"data-id": submission._id, 
						onClick: this.onClickPlayButton}, 
					React.createElement("div", null, 
						React.createElement("span", {className: "index"}, Utils.padDigits(index+1, 2)), 
						React.createElement("span", {className: "title"}, submission['title'])
					)
				), 
				React.createElement("button", {className: "icon icon-pause play-button", 
					"data-id": submission._id, 
					onClick: this.onClickPlayButton}, 
					React.createElement("span", null, "Play")
				)
			)
		);
	},

	handleEnterViewport: function() {

		if(this.player && !this.player.paused) {
			this.refs.audioPulser.play();
		}
	},

	handleExitViewport: function() {

		this.refs.audioPulser.pause();
	},

	onClickPlayButton: function(e) {

		var submissionId = e.currentTarget.getAttribute('data-id');

		var submission = _.find(this.state.submissions, {
			_id: submissionId
		});

		var shouldPlay = (submission !== this.state.currentSubmission) ? true : this.player.paused;

		this.setState({
			currentSubmission: submission,
			paused: !shouldPlay
		});
	},

	render: function() {

		var titleText = this.props.phone ?
			'THIS IS THE<br/>PERFECT MUSIC<br/>FOR EXPERIENCING<br/>THIS SITE.' :
			'THIS IS THE PERFECT MUSIC<br/>FOR EXPERIENCING THIS SITE.';

		var canvasHeading = this.props.useCanvasText ? (
			React.createElement(ShineCanvas, {color: "gold", text: titleText})
		) : null;

		var headingClassname = classnames('golden-heading', {
			'use-canvas': this.props.useCanvasText
		});

		var numSubmissions = this.state.submissions.length;
		
		var leftStartIndex = numSubmissions - 10;
		var leftEndIndex = numSubmissions - 6;
		var rightStartIndex = numSubmissions - 5;
		var rightEndIndex = numSubmissions - 1;

		var currentIndex = Math.max(0, _.indexOf( this.state.submissions, this.state.currentSubmission ));
		var offsetIndex = 0;

		if(currentIndex < leftStartIndex) {
			offsetIndex = currentIndex - leftStartIndex;
		}else if(currentIndex > rightEndIndex) {
			offsetIndex = currentIndex - rightEndIndex;
		}

		var leftSounds = this.state.submissions.slice(leftStartIndex + offsetIndex, leftEndIndex + offsetIndex + 1);
		var rightSounds = this.state.submissions.slice(rightStartIndex + offsetIndex, rightEndIndex + offsetIndex + 1);

		return (
			React.createElement(BaseSection, {
				classNames: "sound fallback", 
				handleEnterViewport: this.handleEnterViewport, 
				handleExitViewport: this.handleExitViewport}, 
			
				React.createElement("div", {className: "front"}, 
					React.createElement("h2", {className: headingClassname}, 
						React.createElement("span", {dangerouslySetInnerHTML: {__html: titleText}}), 
						canvasHeading
					), 

					React.createElement("div", {className: "cover-container"}, 
						React.createElement("div", {className: "cover"}, 
							React.createElement("div", {className: "icon icon-statue statue"})
						)
					)
				), 

				React.createElement("div", {className: "soundtracks"}, 
					React.createElement("ul", {className: "left"}, 
						leftSounds.map( this.createSoundItem)
					), 
					React.createElement("ul", {className: "right"}, 
						rightSounds.map( this.createSoundItem)
					)
				), 

				React.createElement("div", {className: "back"}, 
					React.createElement("div", {className: "circles"}, 
						React.createElement(AudioPulser, {ref: "audioPulser", 
							speed: 1, circleDelay: .8, thickness: 2})
					)
				)

			)
		);
	}
} );

module.exports = FallbackSoundSection;