var React = require( 'react' );
var ReactDOM = require( 'react-dom' );
var classnames = require( 'classnames' );


var AudioPulser = React.createClass( {displayName: "AudioPulser",

	getDefaultProps: function() {
	    return {
	    	circleDelay: 1.5,
	    	thickness: 4,
	    	speed: 2
	    };
	},

	getInitialState: function() {
	    return {
	    	playing: false
	    };
	},

	componentDidMount: function() {
		
		this.canvas = ReactDOM.findDOMNode( this );
      	this.ctx = this.canvas.getContext('2d');
      	this.ctx.imageSmoothingEnabled = true;

		this.circles = [];
		this.playing = false;
		this.delayedCall;

		$(window).on('resize', this.resize);

		this.resize();
	},

	play: function() {

		if(this.state.playing) {
			return;
		}

        this.setState({
        	playing: true
        });
        
        if(!this.delayedCall) {
        	this.initCircle();
        }else {
        	this.delayedCall.resume();
        }

        TweenMax.ticker.addEventListener('tick', this.draw, this);
	},

	pause: function() {

		if(!this.state.playing) {
			return;
		}

        this.setState({
        	playing: false
        });
        
        this.delayedCall.pause();
        TweenMax.ticker.removeEventListener('tick', this.draw, this);
	},

	resize: function() {

		var $canvas = $(this.canvas);
		this.canvas.width = $canvas.width();
		this.canvas.height = $canvas.height();
	},

	initCircle: function() {

		var a = {
		  r: 0,
		  o: 1
		};

		this.circles.push(a);

		this.delayedCall = TweenMax.delayedCall(this.props.circleDelay, this.initCircle);
	},

	clearCircleFromArray: function() {

		this.circles.shift();
	},

	expandCircle: function(a) {

		if(!a) {
		  return;
		}

		a.o = ((this.canvas.width >> 1) - a.r) / (this.canvas.width >> 1);
		a.r += this.props.speed;

		if(a.o < 0) {
		  this.clearCircleFromArray();
		}
	},

	drawCircle: function(a) {

		if(!a) {
		  return;
		}

		var b = 50;
		var d = a.r;
		var c = a.o;

		this.ctx.beginPath();
		this.ctx.arc(this.canvas.width >> 1, this.canvas.height >> 1, d, 0, 2 * Math.PI, false);
		this.ctx.lineWidth = this.props.thickness;
		this.ctx.strokeStyle = 'rgba(' + b + ',' + b + ',' + b + ',' + c + ')';
		this.ctx.closePath();
		this.ctx.stroke();
	},

	draw: function() {

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (var a = 0; a < this.circles.length; a++) {
        	var circle = this.circles[a];
			this.expandCircle(circle);
			this.drawCircle(circle);
        }
	},

	render: function() {

		var className = classnames('audio-pulser', {
			'playing': this.state.playing
		});

		return (
			React.createElement("canvas", {className: className})
		);
	}
} );

module.exports = AudioPulser;