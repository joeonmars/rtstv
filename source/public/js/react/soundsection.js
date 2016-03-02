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

var scrollController;
var socket;

var ErrorMessage = {
	'notstreamable': 'This soundtrack is not streamable. Try using a different one.',
	'invalid': 'Please enter a valid URL.'
};

var SoundSection = React.createClass( {displayName: "SoundSection",

	dom: null,
	fftSize: 256,
	audioCtx: null,
	streamData: null,
	sampleInterval: 0,
	analyser: null,
	player: null,
	sineWaves: null,
	volumeHi: 0,

	mixins: [ DurationWatcher ],

	getDefaultProps: function() {

		return {
			title: 'THIS IS THE PERFECT MUSIC<br/>FOR EXPERIENCING THIS SITE.',
			useCanvasText: true
		};
	},

	getInitialState: function() {

		var firstSubmission = this.props.submissions[0];

		return {
			submissions: this.props.submissions,
			currentSubmission: firstSubmission,
			inputContent: '',
			trackTitle: 'Soundtrack title',
			trackUser: 'Soundtrack user',
			manualPaused: true,
			errorMessage: '',
			validated: false
		};
	},

	componentDidMount: function() {

		this.streamData = new Uint8Array( this.fftSize / 2 );

		this.audioCtx = new( window.AudioContext || window.webkitAudioContext );

	    this.biquadFilter = this.audioCtx.createBiquadFilter();
	    this.biquadFilter.type = "lowpass";
	    this.biquadFilter.frequency.value = 3000;
	    this.biquadFilter.Q.value = 10;
	    this.biquadFilter.gain.value = 20;

	    this.gainNode = this.audioCtx.createGain();
	    this.gainNode.gain.value = 1;

	    this.biquadFilter.connect(this.gainNode);
	   	this.gainNode.connect(this.audioCtx.destination);

	   	//
		pubSub.anyMediaPlayed.add( this.onAnyMediaPlayed, this );
		pubSub.nextSoundClicked.add( this.playNext, this );
		pubSub.prevSoundClicked.add( this.playPrev, this );
		pubSub.soundToggled.add( this.togglePlay, this );

		this.requestXhr = null;
		this.nextSubmissionContent = null;

		// create waves
		this.sineWaves = this.createWaves();

		// create matrices for transforming elements
		var CssToMatrix = require('css-to-matrix');
		this.statueCssToMatrix = new CssToMatrix();
		this.coverCssToMatrix = new CssToMatrix();

		//
		scrollController = require('controllers/scrollcontroller');
		this.lockedOnce = false;

		//
		this.loadTrack( this.state.currentSubmission.content )
			.then( this.onTrackRequestSucceed, this.playNext );

		//
		var socketController = require('controllers/socketcontroller')();
		socket = socketController.getSocketByNamespace( 'submission' );

		var initialSubmissionIds = _.map(this.props.submissions, function(sub) {
			return sub._id;
		});

		socket.emit( global.config.EVENTS.SUBMISSIONS_APPEARED_FROM_CLIENT, {
			'submissionIds': initialSubmissionIds
		} );
	},

	componentDidUpdate: function( prevProps, prevState ) {

		if ( prevState.currentSubmission !== this.state.currentSubmission ) {

			this.stopTrackingDuration();

			if(this.requestXhr && this.requestXhr.state() === 'pending') {
				this.requestXhr.abort();
			}

			this.requestXhr = this.loadTrack( this.state.currentSubmission.content )
				.done( this.onTrackRequestSucceed ).fail( this.onTrackRequestFail );
		}

		if ( prevState.manualPaused !== this.state.manualPaused ) {

			if(this.state.manualPaused) {
				this.player.pause();
			}else {
				this.player.play();
			}
		}
	},

	createAnalyser: function( player ) {

		var analyser = this.audioCtx.createAnalyser();
		analyser.fftSize = this.fftSize;

		var source = this.audioCtx.createMediaElementSource( player );
		source.connect( analyser );

		analyser.connect( this.biquadFilter );

		return analyser;
	},

	sampleAudioStream: function() {

		this.analyser.getByteFrequencyData( this.streamData );

		var totalHi = 0;
		for (var i = 31; i < 64; i++) {
			totalHi += this.streamData[i];
		}

		this.volumeHi = totalHi;
	},

	createWaves: function() {

		var $waves = $(this.refs.waves);

		var sineWaves = new SineWaves({

			el: this.refs.wavesCanvas,

			speed: 2,

			running: false,

			dpr: 1,

			width: function() {
				return $waves.width();
			},

			height: function() {
				return $waves.height();
			},

			ease: 'SineInOut',

			wavesWidth: '140%',

			waves: [
				{
				  timeModifier: 0.5,
				  lineWidth: 1,
				  maxAmplitude: -25,
				  wavelength: 80
				},
				{
				  timeModifier: 0.75,
				  lineWidth: 1,
				  maxAmplitude: 35,
				  wavelength: 80
				},
				{
				  timeModifier: 3,
				  lineWidth: 2,
				  maxAmplitude: -50,
				  wavelength: 75
				},
				{
				  timeModifier: 2,
				  lineWidth: 2,
				  maxAmplitude: 50,
				  wavelength: 70
				},
				{
				  timeModifier: 2,
				  lineWidth: 3,
				  maxAmplitude: -65,
				  wavelength: 80
				},
				{
				  timeModifier: 4,
				  lineWidth: 4,
				  maxAmplitude: 75,
				  wavelength: 100
				}
			],

			resizeEvent: function() {

				var index = -1;

				var length = this.waves.length;

				while(++index < length){

				  var alpha = Math.pow( Utils.lerp(0.2, 1, index/(length-1)), 2 );
				  
				  var gradient = this.ctx.createLinearGradient(0, 0, this.width, 0);
				  gradient.addColorStop(0, "rgba(200, 169, 71, " + 0 + ")");
				  gradient.addColorStop(.5, "rgba(200, 169, 71, " + alpha + ")");
				  gradient.addColorStop(1, "rgba(200, 169, 71, " + 0 + ")");

				  this.waves[index].strokeStyle = gradient;
				}
			}
		});

		// init waves
		var i, l = sineWaves.waves.length;

		for(i = 0; i < l; i++) {
			var wave = sineWaves.waves[i];
			wave.amplitude = wave.maxAmplitude * .25;
		}

		TweenMax.set(sineWaves.el, {
			opacity: .25
		});

		//
		return sineWaves;
	},

	loadTrack: function( url ) {

		var track = urlValidator.matchSoundCloudURL( url ).track;
		var endpoint = global.config.SERVER_URL + '/soundcloud/' + track;

		var xhr = $.get( endpoint );
		return xhr;
	},

	playTrack: function() {

		if ( this.player ) {

			this.setState({
				manualPaused: false
			});

			this.player.play();

			this.refs.audioPulser.play();
		}
	},

	pauseTrack: function() {

		if ( this.player ) {

			this.setState({
				manualPaused: true
			});

			this.player.pause();

			this.refs.audioPulser.pause();
		}
	},

	togglePlay: function() {

		if( this.state.manualPaused ) {
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

	disposeTrack: function() {

		if ( this.player ) {
			this.player.pause();
			$( this.player ).off();
		}
	},

	onTrackRequestSucceed: function( data ) {

		var clientId = data[ 'client_id' ];
		var streamUrl = data[ 'stream_url' ] + '?client_id=' + clientId;

		this.disposeTrack();

		this.player = new Audio();
		this.player.crossOrigin = 'anonymous';
		this.player.setAttribute( 'src', streamUrl );

		$( this.player )
			.on( 'play', this.onTrackPlay )
			.on( 'pause', this.onTrackPause )
			.on( 'ended', this.onTrackEnded );

		this.analyser = this.createAnalyser( this.player );

		if ( !this.state.manualPaused ) {
			this.playTrack();
		}

		//
		var title = data[ 'title' ];
		var username = data[ 'user' ][ 'username' ];
		var duration = data['duration'] / 1000;
		var image = data['artwork_url'] || data[ 'user' ][ 'avatar_url' ];

		this.setState( {
			trackTitle: title,
			trackUser: username
		} );

		pubSub.soundChanged.dispatch( this.player, {
			index: _.indexOf(this.state.submissions, this.state.currentSubmission),
			total: this.state.submissions.length,
			title: title,
			username: username,
			duration: duration,
			image: image
		} );
	},

	onTrackRequestFail: function( xhr, textStatus ) {

		// If the request failure is not caused by an intentional abort,
		// skip to the next song
		if(textStatus !== 'abort') {
			this.playNext();
		}
	},

	onTrackPlay: function( e ) {

		pubSub.anyMediaPlayed.dispatch( this.player );

		clearInterval( this.sampleInterval );
		this.sampleInterval = setInterval( this.sampleAudioStream, 20 );

		// animate waves
		var waves = this.sineWaves.waves;
		var i, l = waves.length;

		for(i = 0; i < l; i++) {
			
			var wave = waves[i];

			TweenMax.to(wave, 4 + Math.pow(i/(l-1), 4) * 2, {
				amplitude: Math.abs(wave.amplitude)/wave.amplitude * -1 * wave.maxAmplitude,
				ease: Elastic.easeOut
			});
		}

		TweenMax.to(this.sineWaves.el, 1, {
			opacity: 1
		});

		this.startTrackingDuration( this.state.currentSubmission._id, 'sound' );
	},

	onTrackPause: function( e ) {

		clearInterval( this.sampleInterval );

		// animate waves
		var waves = this.sineWaves.waves;
		var i, l = waves.length;

		for(i = 0; i < l; i++) {

			var wave = waves[i];
			
			TweenMax.to(wave, 4, {
				amplitude: wave.maxAmplitude * .25,
				ease: Elastic.easeOut
			});
		}

		TweenMax.to(this.sineWaves.el, 1, {
			opacity: .25
		});

		this.stopTrackingDuration();
	},

	onTrackEnded: function(e) {

		this.playNext();

		this.stopTrackingDuration();
	},

	onAnyMediaPlayed: function( player ) {

		if ( !this.player || this.player === player ) {
			return;
		}

		this.setState({
			manualPaused: true
		});
	},

	onFrameUpdate: function() {

		this.sineWaves.update();

		// I recycled the mental var, this should go from 0 to 1 and jumps in between with the music
		// It's not an ideal beat detector but it works!
		var mental = (Math.min(Math.max((Math.tan(this.volumeHi/6500) * 0.5)), 2));

		// animate cover and statue
		mental = Math.pow(mental, 2);

		this.refs.statue.style.transform = this.statueCssToMatrix
			.perspective(400)
			.translateZ( -140 * mental )
			.rotateX( (-60 * mental) + 'deg' )
			.getMatrixCSS();

		this.refs.cover.style.transform = this.coverCssToMatrix
			.translateY( mental * 30 )
			.getMatrixCSS();
	},

	onClickSoundSelector: function(e) {
		var id = e.currentTarget.getAttribute('data-id');

		var submission = _.find(this.state.submissions, {
			_id: id
		});

		this.setState({
			currentSubmission: submission
		});
	},

	createSoundSelector: function( submission ) {

		var buttonClassName = classnames({
			'active': (this.state.currentSubmission._id === submission._id)
		});

		var index = _.indexOf(this.state.submissions, submission);

		return (
			React.createElement("button", {key: submission._id, 
				className: buttonClassName, 
				"data-id": submission._id, 
				onClick: this.onClickSoundSelector}, 
				React.createElement("div", null, 
					React.createElement("div", {className: "circle"}), 
					React.createElement("span", null, Utils.padDigits(index+1, 2))
				)
			)
		);
	},

	createCircle: function( index ) {

		return React.createElement("div", {key: index, ref: 'circle'+index})
	},

	inputIsEmpty: function() {

		return ( this.state.inputContent.length === 0 );
	},

	validateContent: function() {

		return ( this.state.inputContent.length > 0 );
	},

	setInputContent: function( e ) {

		this.setState( {
			inputContent: e.target.value
		} );
	},

	handleEnterViewport: function() {

		if(this.biquadFilter && this.gainNode.gain) {

			TweenMax.to(this.biquadFilter.frequency, 4, {
				value: 3000
			});

			TweenMax.to(this.gainNode.gain, 4, {
				value: 1
			});
		}

		TweenMax.ticker.addEventListener('tick', this.onFrameUpdate, this);

		if(!this.player.paused && !this.player.ended) {
			this.refs.audioPulser.play();
		}

		// lock to viewport center on entering, for only once
		// automatically start playing when locked
		if(!this.lockedOnce && scrollController) {
			
			this.lockedOnce = true;

			var back = ReactDOM.findDOMNode( this.refs.back );
			var backPageOffsetY = $(back).offset().top;
			var backMarginAfterCentering = ($(window).height() - $(back).height())/2;
			var y = backPageOffsetY - Math.max(0, backMarginAfterCentering);

			scrollController.scrollToAndLock( y, null, this.playTrack );
		}
	},

	handleExitViewport: function() {

		if(this.biquadFilter && this.gainNode.gain) {

			TweenMax.to(this.biquadFilter.frequency, 4, {
				value: 1000
			});

			TweenMax.to(this.gainNode.gain, 4, {
				value: .35
			});
		}

		TweenMax.ticker.removeEventListener('tick', this.onFrameUpdate, this);

		this.refs.audioPulser.pause();
	},

	submitSound: function() {

		var matchedResult = urlValidator.matchSoundCloudURL( this.state.inputContent );

		if(!matchedResult) {

			// is not a valid soundcloud URL
			this.setState({

				validated: false,
				errorMessage: ErrorMessage['invalid']

			}, this.refs.input.highlight );

		}else {

			this.loadTrack( this.state.inputContent ).fail(function(err) {

				// is not streamable
				this.setState({

					validated: false,
					errorMessage: ErrorMessage['notstreamable']

				}, this.refs.input.highlight );

			}.bind(this)).done(function() {

				// is valid and streamable soundcloud URL
				// e.g. https://soundcloud.com/adham-safena/chet-baker-almost-blue
				socket.emit(global.config.EVENTS.SUBMISSION_SENT_FROM_CLIENT, {
					type: 'sound',
					content: this.state.inputContent
				}, this.onSubmissionSavedByServer);

			}.bind(this));
		}
	},

	onSubmitSound: function(e) {

		if(e) {
			e.preventDefault();
		}
		
		pubSub.submissionToBePosted.dispatch( this.submitSound );
	},

	onSubmissionSavedByServer: function( data ) {

		console.log( 'Submission %s has been saved by server.', data._id, data );

		var submissions = this.state.submissions;

		var existSubmission = _.find(submissions, {
			_id: data._id
		});

		// add the new sound submission, empty the input field
		// and play it immediately
		this.setState({
			inputContent: '',
			submissions: existSubmission ? submissions : submissions.concat( data ),
			currentSubmission: existSubmission || data,
			validated: true,
			manualPaused: false
		});
	},

	render: function() {

		var playButtonClassName = classnames('play icon', (this.state.manualPaused ? 'icon-play' : 'icon-pause') );

		var canvasHeading = this.props.useCanvasText ? (
			React.createElement(ShineCanvas, {color: "gold", text: this.props.title})
		) : null;

		var headingClassname = classnames('golden-heading', {
			'use-canvas': this.props.useCanvasText
		});

		var editControlsClassName = classnames('edit-controls', {
			'has-error': !this.state.validated
		});

		var numSubmissions = this.state.submissions.length;
		
		var leftStartIndex = numSubmissions - 10;
		var leftEndIndex = numSubmissions - 6;
		var rightStartIndex = numSubmissions - 5;
		var rightEndIndex = numSubmissions - 1;

		var currentIndex = _.indexOf( this.state.submissions, this.state.currentSubmission );
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
				classNames: "sound", 
				handleEnterViewport: this.handleEnterViewport, 
				handleExitViewport: this.handleExitViewport}, 

				React.createElement("div", {className: "front"}, 

					React.createElement("h2", {className: headingClassname}, 
						React.createElement("span", {dangerouslySetInnerHTML: {__html: this.props.title}}), 
						canvasHeading
					), 

					React.createElement("div", {className: "info-container"}, 
						React.createElement("h5", null, this.state.trackTitle), 
						React.createElement("h6", null, this.state.trackUser)
					), 

					React.createElement("div", {className: "main-container"}, 
						React.createElement("div", {className: "sound-selectors"}, 
							React.createElement("div", {className: "inner"}, 
							leftSounds.map( this.createSoundSelector)
							)
						), 
						React.createElement("div", {ref: "cover", className: "cover"}, 
							React.createElement("div", {ref: "statue", className: "icon icon-statue statue"})
						), 
						React.createElement("div", {className: "sound-selectors"}, 
							React.createElement("div", {className: "inner"}, 
							rightSounds.map( this.createSoundSelector)
							)
						)
					), 

					React.createElement("div", {className: "player-controls"}, 
						React.createElement("button", {className: "icon icon-fast-rewind", onClick: this.playPrev}), 
						React.createElement("button", {className: playButtonClassName, onClick: this.togglePlay}), 
						React.createElement("button", {className: "icon icon-fast-forward", onClick: this.playNext})
					), 

					React.createElement("div", {className: editControlsClassName}, 
						React.createElement("form", {onSubmit: this.onSubmitSound}, 
							React.createElement(Input, {ref: "input", placeholder: "ADD A SOUNDCLOUD TRACK URL", editable: true, html: this.state.inputContent, onChange: this.setInputContent}), 
							React.createElement("button", {className: "post-button", disabled: this.inputIsEmpty(), onClick: this.onSubmitSound}, "Post")
						), 
						React.createElement("span", {className: "error"}, this.state.errorMessage)
					)
				), 

				React.createElement("div", {className: "back", ref: "back"}, 
					React.createElement("div", {className: "waves", ref: "waves"}, 
						React.createElement("canvas", {ref: "wavesCanvas"})
					), 
					React.createElement("div", {className: "circles"}, 
						React.createElement(AudioPulser, {ref: "audioPulser"})
					)
				)
			
			)
		);
	}
} );

module.exports = SoundSection;