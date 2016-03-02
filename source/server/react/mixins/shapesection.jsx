var React = require( 'react' );
var ReactDOM = require( 'react-dom' );
var classnames = require( 'classnames' );
var BaseSection = require( '../basesection' );


var mixins = {

	propTypes: {
	    shape: React.PropTypes.string.isRequired,
	    classNames: React.PropTypes.string.isRequired,
	    autoLock: React.PropTypes.bool,
	    showScrollButton: React.PropTypes.bool
	},

	componentDidMount: function() {

		this.lockedOnce = false;

		// create matrices for transforming shape
		var CssToMatrix = require('css-to-matrix');
		this.shapeCssToMatrix = new CssToMatrix();
	},

	handleEnterViewport: function() {

		TweenMax.ticker.addEventListener('tick', this.onFrameUpdate, this);
	},

	handleExitViewport: function() {

		TweenMax.ticker.removeEventListener('tick', this.onFrameUpdate, this);
	},

	onFrameUpdate: function() {

		// animate shape
		if(this.refs.shape) {

			var time = TweenLite.ticker.time;

			this.refs.shape.style.transform = 
			this.refs.shape.style.webkitTransform = this.shapeCssToMatrix
				.perspective( 800 )
				.translateZ( Math.sin(time) * 20 )
				.rotateY( (Math.cos(time) * 10) + 'deg' )
				.getMatrixCSS();
		}
	},

	render: function() {

		var shape = this.props.shape ? (
			<div className={'shape ' + this.props.shape} ref='shape'></div>
		) : null;

		var classNames = classnames('shape-section', this.props.classNames);

		var scrollButton = this.props.showScrollButton ? (
			<button className='scroll-button'>
				<div>
					<p>Keep scrolling</p>
					<div className='icon icon-arrow-down'></div>
				</div>
			</button>
		) : null;

		return (
			<BaseSection
				classNames={classNames}
				scrollWatchOffset={-50}
				handleEnterViewport={this.handleEnterViewport}
				handleExitViewport={this.handleExitViewport} >

				<div className='content-container'>
					<div className='back' ref='back'>
						{shape}
					</div>

					<div className='front'>
						{this.renderFront()}
					</div>
				</div>

				{scrollButton}

			</BaseSection>
		);
	}

};

module.exports = mixins;