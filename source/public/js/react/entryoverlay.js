var React = require( 'react' );
var ReactDOM = require( 'react-dom' );
var classnames = require( 'classnames' );
var PrimaryButton = require( './primarybutton' );
var ShineCanvas = require( './fx/shinecanvas' );


var EntryOverlay = React.createClass( {displayName: "EntryOverlay",

	getDefaultProps: function() {

		return {
			onClickButton: null,
			onAnimateOutComplete: null,
			title: 'IF YOU THINK YOUR INTERACTIVE<br/>CAMPAIGN IS MORE PERFECTLY<br/>INTERACTIVE THAN THIS,<br/>SUBMIT IT TO THE ANDYs.',
			useCanvasText: true
		};
	},

	componentDidMount: function() {

		TweenMax.to(this.refs.blackCurtain, 2, {
			delay: 1,
			opacity: 0,
			display: 'none'
		});

		TweenMax.fromTo(this.refs.inner, .5, {
			opacity: 0
		},{
			delay: 2.5,
			opacity: 1
		});
	},

	animateOut: function() {

		var thisEl = ReactDOM.findDOMNode( this );

		TweenMax.to(this.refs.inner, 1, {
			opacity: 0
		});

		TweenMax.to(thisEl, 1, {
			delay: 1,
			opacity: 0,
			ease: Expo.easeOut,
			onComplete: this.props.onAnimateOutComplete
		});
	},

	render: function() {

		var canvasHeading = this.props.useCanvasText ? (
			React.createElement(ShineCanvas, {color: "gold", text: this.props.title})
		) : null;

		var headingClassname = classnames('golden-heading', {
			'use-canvas': this.props.useCanvasText
		});

		return (
			React.createElement("div", {id: "entry-overlay", className: "device-viewport-height"}, 

				React.createElement("div", {className: "background"}), 

				React.createElement("div", {ref: "inner", className: "inner"}, 
					React.createElement("h2", {className: headingClassname}, 
						React.createElement("span", {dangerouslySetInnerHTML: {__html: this.props.title}}), 
						canvasHeading
					), 

					React.createElement(PrimaryButton, {text: "Yes, my work is better.", href: "https://www.andyawards.com/enter-now/", 
						onClick: this.props.onClickButton})
				), 

				React.createElement("div", {ref: "blackCurtain", className: "black-curtain"})

			)
		);
	}
} );

module.exports = EntryOverlay;