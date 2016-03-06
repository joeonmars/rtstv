var React = require( 'react' );
var ReactDOM = require( 'react-dom' );
var BaseSection = require('./base');
var classnames = require('classnames');


var Promo = React.createClass( {

	getInitialState: function() {

	    return {
	    	showFigure: false,
	    	screenMetrics: {
	    		left: 0,
	    		bottom: 0,
	    		width: 0,
	    		height: 0
	    	}
	    };
	},

	componentDidMount: function() {

		$(window).resize( this.resize );
		this.resize();

		// Create a matrix for wiggling the figure
		var CssToMatrix = require('css-to-matrix');
		this.figureCssToMatrix = new CssToMatrix();

		this.wiggleX = 0;
		this.mouseWiggleX = 0;

		// Preload figure assets, animate in figure
		// upon load completion
		var figureAssets = [
			'/images/promo-figure.png',
			'/images/promo-app-background.png',
			'/images/promo-app-sponsor.png'
		];

		$.preload( figureAssets ).done( this.showFigure ).fail( this.showFigureFallback );
	},

	showFigure: function() {

		this.setState({
			showFigure: true
		});
	},

	showFigureFallback: function() {

		// TODO: Provide a fallback solution
		console.log("Show figure fallback, because the assets failed to load...");
	},

	resize: function() {

		// Current background container size
		var $background = $(this.refs.background);
		var bgW = $background.width();
		var bgH = $background.height();

		// Original background image size
		var imgW = 680;
		var imgH = 840;

		// Original phone screen size and position
		var screenW = 289;
		var screenH = 513;
		var screenT = 81;
		var screenL = 122;

		// Calculate the actual background image size and position,
		// according to its background-size CSS rules (center bottom)
		var actualBgW, actualBgH;

		if(bgW / bgH < imgW / imgH){

			actualBgW = bgW;
			actualBgH = bgW / (imgW / imgH);

		}else {

			actualBgH = bgH;
			actualBgW = bgH * (imgW / imgH);
		}

		var actualBgL = (bgW - actualBgW) / 2;
		var actualBgT = bgH - actualBgH;

		var actualScreenW = actualBgW * (screenW / imgW);
		var actualScreenH = actualBgH * (screenH / imgH);
		var actualScreenL = actualBgL + actualBgW * (screenL / imgW);
		var actualScreenT = actualBgT + actualBgH * (screenT / imgH);

		this.setState({
			screenMetrics: {
				top: actualScreenT + 'px',
				left: actualScreenL + 'px',
				width: actualScreenW + 'px',
				height: actualScreenH + 'px'
			}
		});
	},

	onEnteredViewport: function() {

		// Enable wiggle interaction for desktop
		if(!global.mobile) {

			$(document).on('mousemove', this.onMouseMove);
			TweenMax.ticker.addEventListener('tick', this.onAnimationFrame);
		}
	},

	onExitViewport: function() {

		// Disable wiggle interaction for desktop
		if(!global.mobile) {

			$(document).off('mousemove', this.onMouseMove);
			TweenMax.ticker.removeEventListener('tick', this.onAnimationFrame);
		}
	},

	onMouseMove: function(e) {

		var windowW = window.innerWidth;
		var windowHW = windowW / 2;
		this.mouseWiggleX = (e.clientX - windowHW) / windowW * 2;
	},

	onAnimationFrame: function() {

		var time = TweenLite.ticker.time;
		this.wiggleX += (this.mouseWiggleX - this.wiggleX) * .05;

		this.refs.figure.style.transform = 
		this.refs.figure.style.webkitTransform = this.figureCssToMatrix
			.perspective( 800 )
			.translateZ( Math.sin(time) * 4 )
			.rotateY( (this.wiggleX * 2) + 'deg' )
			.getMatrixCSS();
	},

	renderOuter: function() {

		return(
			<div className='control'>
				<button>
					<span className='icon icon-scroll-arrow'></span>
				</button>
			</div>
		);
	},

	render: function() {

		var data = this.props.data;

		var figureClassName = classnames({
			'show': this.state.showFigure
		});

		return (
			<BaseSection id='promo' outer={this.renderOuter()}
				handleEnteredViewport={this.onEnteredViewport} handleExitViewport={this.onExitViewport}>

				<article>
					<div>
						<h1 className='heading' dangerouslySetInnerHTML={{__html: data.heading}}></h1>
						<div className='body' dangerouslySetInnerHTML={{__html: data.body}}></div>
					</div>
				</article>

				<figure className={figureClassName} ref='figure'>
					<div className='background' ref='background'>
						<div className='screen' style={this.state.screenMetrics}>
							<div className='app-background'></div>
							<div className='app-sponsor'></div>
						</div>
					</div>
				</figure>

			</BaseSection>
		);
	}
});


module.exports = Promo;