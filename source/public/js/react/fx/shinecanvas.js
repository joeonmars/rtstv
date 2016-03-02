var _ = require( 'underscore' );
var React = require( 'react' );
var ReactDOM = require( 'react-dom' );
var Utils = require( '../../helpers/utils' );

var dpr = 1;
var lineHeight = 1.25;
var maxFontSize = 60;
var fontSize = 0;
var canRender = false;
var supportWebGL = undefined;

var ShineCanvas = React.createClass( {displayName: "ShineCanvas",

	statics: {

		shouldUseGL: function() {
			
			if(!global.document) {
				return false;
			}

			if(_.isBoolean(global.props.usegl)) {
				return global.props.usegl;
			}

			supportWebGL = _.isBoolean(supportWebGL) ? supportWebGL : Utils.supportWebGL();
			if(supportWebGL === false) {
				return false;
			}
			
			return true;
		}
	},

	getDefaultProps: function() {

	    return {
	    	color: 'gold',
	    	text: null
	    };
	},

	getInitialState: function() {

	    return {
	    	cssWidth: null
	    };
	},

	componentDidMount: function() {
		
		// Read dpr for retina support
		dpr = Math.max(1, window.devicePixelRatio);

		this.dom = ReactDOM.findDOMNode(this);
		this.$parent = $(this.dom).parent();

		this.ctx = this.dom.getContext('2d');

		// start shine render
		if(ShineCanvas.shouldUseGL()) {
			this.shine = require( 'views/fx/shine' )();
			this.shineCanvas = this.shine.getCanvas();
		}

		// create text canvas if text is provided
		if(this.props.text) {
			this.textCanvas = $('<canvas>').get(0);
		}

		// if no GL support, load fallback texture image
		if(!ShineCanvas.shouldUseGL()) {

			this.textureImg = new Image();
			$(this.textureImg).load( this.drawCanvasFallback );
			this.textureImg.src = ('/images/{color}-texture.jpg').replace('{color}', this.props.color);
		}

		// initial resize
		$(window).on('resize', this.resize);
		this.resize();

		// start render immediately,
		// or after wait for the font to load
		if(canRender) {

			this.startRender();

		}else {

			var timeStart = Date.now();
			var timeout = 2000;

			var fontLoadTimer = setInterval( function() {

				var exceedTimeout = (Date.now() - timeStart > timeout);

				if(window.fontLoaded || exceedTimeout) {

					clearInterval(fontLoadTimer);

					canRender = true;
					this.startRender();
				}

			}.bind(this), 20 );
		}
	},

	componentWillUnmount: function() {

		$(window).off('resize', this.resize);
		TweenMax.ticker.removeEventListener('tick', this.onFrameUpdate, this);
	},

	startRender: function() {

		this.resize();

		if(ShineCanvas.shouldUseGL()) {

			TweenMax.ticker.addEventListener('tick', this.onFrameUpdate, this);

		}else {

			this.drawCanvasFallback();
		}
	},

	resize: function() {

		if(this.props.text) {

			this.fitCanvasToText();

			if(!ShineCanvas.shouldUseGL()) {
				this.drawCanvasFallback();
			}

		}else {

			this.fitCanvasToParent();
		}
	},

	updateTextCanvasContext: function() {

		var ctx = this.textCanvas.getContext('2d');
		ctx.font = '700 ' + fontSize + 'px futura-pt';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		ctx.fillStyle = '#fff';

		return ctx;
	},

	fitCanvasToText: function() {

		// create lines
		var maxLineCharas = 0;

		var lines = _.map( this.props.text.split('<br/>'), function(line) {
			maxLineCharas = Math.max(maxLineCharas, line.length);
			return line;
		});

		// calculate font size based on width
		fontSize = Math.min( maxFontSize, Math.round(this.$parent.outerWidth() / maxLineCharas * 2) ) * dpr;

		// measure maximum line width
		var ctx = this.updateTextCanvasContext();

		var maxLineWidth = 0;

		_.each( lines, function(line) {
			var lineWidth = ctx.measureText( line ).width;
			maxLineWidth = Math.max( maxLineWidth, lineWidth );
		} );

		// resize canvas
		this.textCanvas.width = this.dom.width = Math.round( maxLineWidth );
		this.textCanvas.height = this.dom.height = Math.round( lineHeight * fontSize * lines.length );

		this.setState({
			cssWidth: this.textCanvas.width / dpr + 'px'
		});

		// draw text
		this.updateTextCanvasContext();

		_.each( lines, function(line, i) {

			var x = Math.round( maxLineWidth / 2 );
			var y = Math.round( i * lineHeight * fontSize );

			ctx.fillText(line, x, y);
		} );
	},

	fitCanvasToParent: function() {

		this.dom.width = this.$parent.outerWidth();
		this.dom.height = this.$parent.outerHeight();
	},

	copyFromShine: function() {

		var clipX, clipY, clipW, clipH;

		var sourceCanvas = this.dom;
		var sourceAspect = sourceCanvas.width / sourceCanvas.height;

		if(this.props.color === 'gold') {

			clipX = 0;
			clipY = 0;

		}else if(this.props.color === 'silver') {

			clipX = 0;
			clipY = this.shineCanvas.height / 2;
		}

		clipW = Math.min( sourceCanvas.width * dpr, this.shineCanvas.width );
		clipH = clipW / sourceAspect;

		this.ctx.drawImage( this.shineCanvas, clipX, clipY, clipW, clipH, 0, 0, sourceCanvas.width, sourceCanvas.height );
	},

	drawCanvasFallback: function(e) {

		if(!this.textureImg.width) {
			return;
		}

		if(this.textCanvas) {
			this.ctx.drawImage( this.textCanvas, 0, 0 );
			this.ctx.globalCompositeOperation = 'source-atop';
		}

		var pattern = this.ctx.createPattern( this.textureImg, 'repeat' );
		this.ctx.fillStyle = pattern;

		this.ctx.fillRect(0, 0, this.dom.width, this.dom.height);
	},

	onFrameUpdate: function() {

		if(this.textCanvas) {
			this.ctx.drawImage( this.textCanvas, 0, 0 );
			this.ctx.globalCompositeOperation = 'source-atop';
		}

		this.copyFromShine();
	},

	render: function() {

		var canvasStyle = {
			'width': this.state.cssWidth
		};

		return (
			React.createElement("canvas", {style: canvasStyle})
		);
	}
} );

module.exports = ShineCanvas;