var moment = require('moment');
require('moment-duration-format');

var _ = require( 'underscore' );
var React = require( 'react' );
var ReactDOM = require( 'react-dom' );
var classnames = require( 'classnames' );
var Utils = require( '../helpers/utils' );
var pubSub = require( '../helpers/pubsub' );


var StickySoundPlayer = React.createClass( {displayName: "StickySoundPlayer",

	getInitialState: function() {

		return {
			shown: false,
			compact: true,
			playing: false,
			duration: 0,
			currentTime: 0,
			progress: 0,
			index: 0,
			total: 0,
			title: '',
			username: '',
			image: null
		};
	},

	componentDidMount: function() {

		this.$player = null;
		this.animateToCompactDelay = null;

		pubSub.soundChanged.add( this.onSoundChanged );

		this.$window = $(window).on('scroll', this.updateShownState);
	},

	componentDidUpdate: function(prevProps, prevState) {

		if(prevState.playing !== this.state.playing) {

			if(this.state.playing) {

				TweenMax.ticker.addEventListener('tick', this.onFrameUpdate);

			}else {

				TweenMax.ticker.removeEventListener('tick', this.onFrameUpdate);
			}
		}
	},

	showAsCompact: function() {

		this.setState({
			compact: true
		});
	},

	showAsControls: function() {

		this.setState({
			compact: false
		});
	},

	onSoundChanged: function(player, data) {

		if(this.$player) {
			this.$player.off();
		}

		this.$player = $(player)
			.on('play', this.onPlay)
			.on('pause', this.onPause)
			.on('timeupdate', this.onTimeUpdate)
			.on('loadmetadata', this.onLoadMetaData);

		this.setState( data );
		this.updateShownState();
	},

	onPlay: function( e ) {

		this.setState({
			playing: true
		});
	},
	
	onPause: function( e ) {

		this.setState({
			playing: false
		});
	},

	onTimeUpdate: function( e ) {

		this.setState({
			currentTime: e.target.currentTime
		});
	},

	onLoadMetaData: function( e ) {

		this.setState({
			duration: e.target.duration
		});
	},

	onFrameUpdate: function() {

		var player = this.$player.get(0);

		this.setState({
			progress: (player.currentTime / player.duration)
		});
	},

	onMouseEnter: function() {

		clearTimeout( this.animateToCompactDelay );

		this.showAsControls();
	},

	onMouseLeave: function() {

		this.animateToCompactDelay = setTimeout(this.showAsCompact, 800);
	},

	onClickPrevButton: function() {

		pubSub.prevSoundClicked.dispatch();
	},

	onClickNextButton: function() {

		pubSub.nextSoundClicked.dispatch();
	},

	onClickToggleButton: function() {

		pubSub.soundToggled.dispatch();
	},

	updateShownState: function() {

		var breakpointY = this.$window.height();

		var shouldShow = (this.$window.scrollTop() > breakpointY);

		if(shouldShow !== this.state.shown) {

			this.setState({
				shown: (shouldShow && this.$player)
			});
		}
	},

	render: function() {

		var playerClassNames = classnames({
			'compact': this.state.compact,
			'show': this.state.shown
		});

		var playButtonClassName = classnames('play icon', (this.state.playing ? 'icon-pause' : 'icon-play') );

		var gaugeStyle = {
			'width': this.state.progress * 100 + '%'
		};

		var artworkStyle = {
			'backgroundImage': this.state.image ? 'url(' + this.state.image + ')' : null
		};

		var timeFormatOptions = {
			trim: false,
			forceLength: true
		};

		var currentTime = moment.duration(this.state.currentTime, 'seconds').format('mm:ss', timeFormatOptions);
		var totalTime = moment.duration(this.state.duration, 'seconds').format('mm:ss', timeFormatOptions);

		return (
			React.createElement("div", {id: "sticky-sound-player", className: playerClassNames, 
				onMouseEnter: this.onMouseEnter, onMouseLeave: this.onMouseLeave}, 

				React.createElement("div", {className: "inner"}, 

					React.createElement("div", {className: "progress-bar"}, 
						React.createElement("div", {className: "gauge", style: gaugeStyle})
					), 

					React.createElement("div", {className: "controls-container"}, 
						React.createElement("div", {className: "info"}, 
							React.createElement("div", {className: "artwork", style: artworkStyle}), 
							React.createElement("h5", null, 
								React.createElement("span", null, Utils.padDigits(this.state.index+1, 2) + '/' + Utils.padDigits(this.state.total, 2)), 
								this.state.title
							), 
							React.createElement("h6", null, this.state.username)
						), 
						
						React.createElement("div", {className: "buttons"}, 
							React.createElement("button", {className: "icon icon-fast-rewind", onClick: this.onClickPrevButton}), 
							React.createElement("button", {className: playButtonClassName, onClick: this.onClickToggleButton}), 
							React.createElement("button", {className: "icon icon-fast-forward", onClick: this.onClickNextButton})
						), 

						React.createElement("div", {className: "time"}, currentTime + ' / ' + totalTime)
					)

				)

			)
		);
	}
} );

module.exports = StickySoundPlayer;