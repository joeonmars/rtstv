var React = require( 'react' );
var BaseSection = require('./base');


var Realists = React.createClass( {

	componentDidMount: function() {

		// Create a matrix for wiggling the background photo
		var CssToMatrix = require('css-to-matrix');
		this.photoCssToMatrix = new CssToMatrix();
	},

	onEnteredViewport: function() {

		// Enable wiggle animation for desktop
		if(!global.mobile) {

			TweenMax.ticker.addEventListener('tick', this.onAnimationFrame);
		}
	},

	onExitViewport: function() {

		// Disable wiggle animation for desktop
		if(!global.mobile) {

			TweenMax.ticker.removeEventListener('tick', this.onAnimationFrame);
		}
	},

	onAnimationFrame: function() {

		var time = TweenLite.ticker.time / 2;

		this.refs.photo.style.transform = 
		this.refs.photo.style.webkitTransform = this.photoCssToMatrix
			.perspective( 800 )
			.translateZ( Math.sin(time) * 2 )
			.rotateY( Math.cos(time) * 1 + 'deg' )
			.getMatrixCSS();

		this.refs.photo.style.opacity = (Math.sin(time) * .5 + .5) * .3 + .7;
	},

	renderOuter: function() {

		var style = {
			backgroundImage: 'url(images/realists.jpg)'
		};

		return(
			<div className='photo-container'>
				<div className='photo' style={style} ref='photo'></div>
			</div>
		);
	},

	renderQualities: function() {

		var qualities = this.props.data.qualities;

		return qualities.map( function(quality, index) {
			return(
				<li key={index}>
					<p>{quality}</p>
				</li>
			);
		});
	},

	render: function() {

		var data = this.props.data;

		return (
			<BaseSection id='realists' outer={this.renderOuter()}
				handleEnteredViewport={this.onEnteredViewport} handleExitViewport={this.onExitViewport}>

				<article>
					<div>
						<h1 className='heading' dangerouslySetInnerHTML={{__html: data.heading}}></h1>
						<div className='body' dangerouslySetInnerHTML={{__html: data.body}}></div>
						<div className='qualities'>
							<h3 className='label'>{data.qualities_heading}</h3>
							<ul>
								{this.renderQualities()}
							</ul>
						</div>
					</div>
				</article>

			</BaseSection>
		);
	}
});


module.exports = Realists;