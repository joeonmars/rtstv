var React = require( 'react' );
var classnames = require( 'classnames' );
var BaseSection = require( './basesection' );
var BlockCreator = require('./mixins/blockcreator');
var EntryOverlay = require( './entryoverlay' );


var ga;
var Swipeit;
var key;
var scrollController;


var combinations = [
	['image', 'giphy', 'tweet',
	 'tweet', 'image', 'image'],

	['image', 'video',
	 'video', 'image'],

	['image', 'giphy', 'image',
	 'giphy', 'image', 'giphy']
];


var IntroSection = React.createClass( {displayName: "IntroSection",

	mixins: [ BlockCreator ],

	statics: {
		getRandomCombination: function() {

			var layoutId = Math.round( Math.random() * (combinations.length-1) );
			var combination = combinations[ layoutId ];

			return {
				layoutId: layoutId,
				combination: combination
			};
		}
	},

	getDefaultProps: function() {

		return {
			layoutId: 0
		};
	},

	getInitialState: function() {

		return {
			entryOverlayDismissed: false,
			marqueeDismissed: false
		};
	},

	componentDidMount: function() {

		// register client module dependencies
		ga = require( 'react-ga' );

		Swipeit = require('swipeit');

		key = require('keymaster');
		key.setScope('marquee');

		scrollController = require('controllers/scrollcontroller');

		//
		this.willAnimateInMarquee = false;
		this.lockedToFirstPromoOnce = false;

		this.marquee = this.refs.marquee;
		this.submissionsContainer = this.refs.submissionsContainer;
		this.$submissionBlocks = $(this.submissionsContainer).find('.block');

		this.marqueeTweener = null;

		TweenMax.set(this.marquee, {
			opacity: 0,
			y: -20,
			display: 'none'
		});

		TweenMax.set(this.submissionsContainer, {
			opacity: 0,
			visibility: 'hidden'
		});

		TweenMax.set(this.$submissionBlocks, {
			opacity: .1,
			scale: .9
		});

		// hide scrollbar
		$( 'html' ).toggleClass( 'no-scrollbar', true );

		scrollController.disableManualScroll();

		// start counting down
		this.timeout = setTimeout( this.dismissEntryOverlay, 8000 );

		if(global.props.mobile) {

			// start listening swipe to dismiss marquee
			var swipe = new Swipeit(this.refs.marquee);
			swipe.on('north', this.onSwipeToDismissMarquee);

			// disable dragging mobile viewport on marquee
			$(this.refs.marquee).on( 'touchmove', function( e ) {
				e.preventDefault();
			} );

		}else {

			key('esc', 'marquee', this.dismissEntryOverlay);
		}
	},

	dismissEntryOverlay: function(e) {

		clearTimeout( this.timeout );

		this.refs.entryOverlay.animateOut();

		TweenMax.fromTo(this.refs.upper, 2, {
			y: -30,
			scale: 1.1
		},{
			y: 0,
			scale: 1,
			clearProps: 'all',
			delay: 2
		});

		TweenMax.fromTo(this.refs.statue, 2, {
			y: -30,
			scale: 1.2
		},{
			y: 0,
			scale: 1,
			clearProps: 'all',
			delay: 2
		});

		TweenMax.fromTo(this.refs.lower, 2, {
			y: 30,
			scale: 1.1
		},{
			y: 0,
			scale: 1,
			clearProps: 'all',
			delay: 2
		});

		this.marqueeTweener = TweenMax.to(this.marquee, 3, {
			delay: 2,
			opacity: 1,
			y: 0,
			display: '',
			ease: Quad.easeOut
		});

		TweenMax.to(this.submissionsContainer, 3, {
			delay: 3,
			opacity: 1,
			visibility: 'visible',
			ease: Strong.easeInOut
		});

		key.unbind('esc', 'marquee');
	},

	dismissMarquee: function() {

		this.marqueeTweener = TweenMax.to(this.marquee, 2, {
			opacity: 0,
			display: 'none',
			onComplete: this.onMarqueeAnimateOutComplete,
			onCompleteScope: this
		});

		TweenMax.to(this.refs.lower, 1, {
			opacity: 0,
			delay: 0
		});

		TweenMax.to(this.refs.middle, 1, {
			opacity: 0,
			delay: .2
		});

		TweenMax.to(this.refs.upper, 1, {
			opacity: 0,
			delay: .4
		});

		TweenMax.to(this.$submissionBlocks, 2, {
			opacity: 1,
			scale: 1,
			clearProps: 'all',
			ease: Strong.easeOut
		});

		// make sure the page is scrollable
		$( 'html' ).toggleClass( 'no-scrollbar', false );

		// stop listening mousewheel to dismiss marquee
		$( window ).off( 'mousewheel', this.onMouseWheelToDismissMarquee );
	},

	handleFullyEnterViewport: function() {

		if(!this.willAnimateInMarquee) {
			return;
		}else {
			this.willAnimateInMarquee = false;
		}

		//
		TweenMax.to(this.$submissionBlocks, .8, {
			opacity: .1,
			scale: .9
		});

		//
		if(this.state.marqueeDismissed) {

			TweenMax.fromTo(this.refs.upper, 2, {
				opacity: 0,
				y: -30,
				scale: 1.1
			},{
				opacity: 1,
				y: 0,
				scale: 1,
				clearProps: 'all'
			});
		}

		//
		if(this.state.marqueeDismissed) {

			TweenMax.fromTo(this.refs.statue, 2, {
				y: -30,
				scale: 1.2
			},{
				y: 0,
				scale: 1,
				clearProps: 'all'
			});
		}

		//
		if(this.state.marqueeDismissed) {
				
			TweenMax.fromTo(this.refs.middle, 2, {
				opacity: 0
			},{
				opacity: 1,
				delay: .2
			});
		}

		//
		if(this.state.marqueeDismissed) {

			TweenMax.fromTo(this.refs.lower, 2, {
				opacity: 0,
				y: 30,
				scale: 1.1
			},{
				opacity: 1,
				y: 0,
				scale: 1,
				clearProps: 'all',
				delay: .4
			});
		}

		//
		if(this.state.marqueeDismissed) {
			TweenMax.set(this.marquee, {
				opacity: 0,
				y: -50
			});
		}

		TweenMax.to(this.marquee, 2.4, {
			opacity: 1,
			y: 0,
			display: '',
			ease: Strong.easeOut,
			onStart: this.onMarqueeAnimateInStart,
			onStartScope: this,
			onComplete: this.onMarqueeAnimateInComplete,
			onCompleteScope: this
		});
	},

	handleExitViewport: function() {

		this.willAnimateInMarquee = true;

		scrollController.enableManualScroll();
	},

	lockToFirstPromo: function() {

		this.lockedToFirstPromoOnce = true;

		// make sure the page is scrollable
		$( 'html' ).toggleClass( 'no-scrollbar', false );

		var firstPromo = $('.promo')[0];
		var firstPromoPageY = $(firstPromo).offset().top;
		scrollController.scrollToAndLock( firstPromoPageY );
	},

	onEntryOverlayAnimateOutComplete: function() {

		this.setState({
			entryOverlayDismissed: true
		});

		// show scrollbar right after entry, only for desktop
		if(!global.props.mobile) {
			$( 'html' ).toggleClass( 'no-scrollbar', false );
		}

		// start listening mousewheel to dismiss marquee
		$( window ).on('mousewheel', this.onMouseWheelToDismissMarquee );
	},

	onMarqueeAnimateInStart: function() {

		this.setState({
			marqueeDismissed: false
		});

		if(global.props.mobile) {

			// disable touch scroll
			$( 'html' ).toggleClass( 'no-scrollbar', true );

		}else {

			// disable mousewheel scroll
			scrollController.disableManualScroll();
		}
	},

	onMarqueeAnimateInComplete: function() {

		// start listening mousewheel to dismiss marquee
		$( window ).on('mousewheel', this.onMouseWheelToDismissMarquee );
	},

	onMarqueeAnimateOutComplete: function() {

		this.setState({
			marqueeDismissed: true
		});

		if(global.props.phone) {

			// enable touch scroll immediately after marquee,
			// only for phone
			$( 'html' ).toggleClass( 'no-scrollbar', false );

		}else if(global.props.tablet) {

			if(!this.lockedToFirstPromoOnce) {

				// start listening swipe to lock to next
				var swipe = new Swipeit(this.refs.submissionsContainer);
				swipe.on('north', this.onSwipeToLockToFirstPromo);

			}else {

				// enable touch scroll
				$( 'html' ).toggleClass( 'no-scrollbar', false );
			}

		}else {

			if(!this.lockedToFirstPromoOnce) {

				// start listening mousewheel to lock to next
				$( window ).on('mousewheel', this.onMouseWheelToLockToFirstPromo );

			}else {

				// enable mousewheel scroll
				scrollController.enableManualScroll();
			}
		}
	},

	onMouseWheelToDismissMarquee: function(e) {

		if(e.deltaY < -5) {
			this.dismissMarquee();
		}
	},

	onMouseWheelToLockToFirstPromo: function(e) {

		if(e.deltaY < 0) {

			$( window ).off('mousewheel', this.onMouseWheelToLockToFirstPromo );

			this.lockToFirstPromo();
		}
	},

	onSwipeToDismissMarquee: function() {

		if(this.marqueeTweener && !this.marqueeTweener.isActive()) {
			this.dismissMarquee();
		}
	},

	onSwipeToLockToFirstPromo: function() {

		if(this.lockedToFirstPromoOnce) {
			return;
		}

		this.lockToFirstPromo();
	},

	onClickEntryOverlayButton: function() {

		this.dismissEntryOverlay();

		ga.event( {
			category: 'intro overlay enter now',
			action: 'click',
			nonInteraction: false
		} );
	},

	render: function() {

		var submissionsClassName = classnames('submissions', 'layout-' + this.props.layoutId, {
			'ambient': !this.state.marqueeDismissed
		});

		var scrollText = (this.props.mobile ? 'Swipe, it\'s smooth' : 'Scroll, it\'s smooth');
		var titleText = (this.props.mobile ? 'You are having<br/>the best<br/>interactive experience.' : 'You are having the best<br/>interactive experience.');

		var entryOverlay = !this.state.entryOverlayDismissed ? (
			React.createElement(EntryOverlay, {ref: "entryOverlay", 
				onClickButton: this.onClickEntryOverlayButton, 
				onAnimateOutComplete: this.onEntryOverlayAnimateOutComplete})
		) : null;

		return (
			React.createElement(BaseSection, {
				classNames: "intro", 
				handleFullyEnterViewport: this.handleFullyEnterViewport, 
				handleExitViewport: this.handleExitViewport}, 

				entryOverlay, 

				React.createElement("div", {className: "intro-content-container"}, 
					React.createElement("div", {ref: "marquee", className: "marquee device-viewport-height"}, 

						React.createElement("div", {className: "corners"}, 
							React.createElement("div", {className: "tl"}, 
								React.createElement("span", null, "A"), 
								React.createElement("h1", null, 
									React.createElement("span", null, "2016"), 
									React.createElement("span", null, "Andy"), 
									React.createElement("span", null, "Awards")
								)
							), 
							React.createElement("div", {className: "tr"}, 
								React.createElement("span", null, "N")
							), 
							React.createElement("div", {className: "bl"}, 
								React.createElement("span", null, "D")
							), 
							React.createElement("div", {className: "br"}, 
								React.createElement("span", null, "Y")
							)
						), 

						React.createElement("div", {className: "inner"}, 
							React.createElement("div", {ref: "upper", className: "upper"}, 
								React.createElement("div", {className: "logo"}, 
									React.createElement("div", {className: "icon icon-statue statue", ref: "statue"}), 
									React.createElement("h2", null, "Beat the best and win an Andy.")
								)
							), 

							React.createElement("h3", {ref: "middle", dangerouslySetInnerHTML: {__html: titleText}}), 

							React.createElement("div", {ref: "lower", className: "lower"}, 
								React.createElement("h4", null, 
									"Powered By:", 
									React.createElement("div", {className: "amazon-logo"}, "Amazon")
								)
							)
						), 

						React.createElement("button", {className: "scroll-button", onClick: this.dismissMarquee}, 
							React.createElement("div", null, 
								React.createElement("p", null, scrollText), 
								React.createElement("div", {className: "icon icon-arrow-down"})
							)
						)

					), 

					React.createElement("div", {ref: "submissionsContainer", className: "submissions-container"}, 
						React.createElement("div", {className: submissionsClassName}, 
							this.props.submissions.map( this.createBlock)
						)
					)
				)

			)
		);
	}
} );

module.exports = IntroSection;