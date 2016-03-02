var React = require( 'react' );
var classnames = require( 'classnames' );
var ShapeSection = require( './mixins/shapesection' );
var ShineCanvas = require( './fx/shinecanvas' );
var PrimaryButton = require( './primarybutton' );

var ga;

var PromoSection = React.createClass( {displayName: "PromoSection",

	mixins: [ ShapeSection ],

	getDefaultProps: function() {

		return {
			classNames: 'promo',
			shape: '',
			title: '',
			paragraph: '',
			ctaText: '',
			ctaUrl: '',
			useCanvas: true,
			showScrollButton: false
		};
	},

	track: function() {

		console.log(this);

		ga.event( {
			category: this.props.trackingCategory,
			action: this.props.trackingAction,
			nonInteraction: false
		} );
	},

	componentDidMount: function() {

		ga = require( 'react-ga' );
	},

	renderFront: function() {

		var paragraph = this.props.paragraph.length > 0 ? (

			React.createElement("div", {className: "paragraph"}, 
				React.createElement("div", {className: "icon icon-divider divider"}), 
				React.createElement("p", {dangerouslySetInnerHTML: {__html: this.props.paragraph}})
			)

		) : null;

		var ctaButton = this.props.ctaText.length > 0 ? (

			React.createElement(PrimaryButton, {text: this.props.ctaText, href: this.props.ctaUrl, onClick: this.track})

		) : null;

		var canvasHeading = this.props.useCanvas ? (

			React.createElement(ShineCanvas, {color: "gold", text: this.props.title})

		) : null;

		var headingClassname = classnames('golden-heading', {
			'use-canvas': this.props.useCanvas
		});

		return (
			React.createElement("div", null, 
				React.createElement("h2", {className: headingClassname}, 
					React.createElement("span", {dangerouslySetInnerHTML: {__html: this.props.title}}), 
					canvasHeading
				), 
				
				paragraph, 

				ctaButton
			)
		);
	}
} );

module.exports = PromoSection;