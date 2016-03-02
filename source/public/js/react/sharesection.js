var React = require( 'react' );
var classnames = require( 'classnames' );
var ShapeSection = require( './mixins/shapesection' );
var ShineCanvas = require( './fx/shinecanvas' );


var ga;


var ShareSection = React.createClass( {displayName: "ShareSection",

	mixins: [ ShapeSection ],

	getDefaultProps: function() {

		return {
			classNames: 'share',
			shape: 'rectangle',
			autoLock: false,
			title: 'THIS EXPERIENCE WAS INDEED<br/>THE BEST. I WILL SHARE IT WITH<br/>MY SOCIAL NETWORKS.',
			useCanvasText: true
		};
	},

	componentDidMount: function() {

		ga = require( 'react-ga' );
	},

	onClickShare: function( e ) {

		var type = e.currentTarget.getAttribute('data-type');

		var popupOptions = {
			width: 0,
			height: 0
		};

		var subjectUrl = 'http://best.andyawards.com/';// + '/share/' + this.state.submissionId;
		var shareUrl;

		switch(type) {
			case 'facebook':
 			popupOptions.width = 640;
    		popupOptions.height = 275;
    		shareUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + subjectUrl;
			break;

			case 'twitter':
			popupOptions.width = 575;
			popupOptions.height = 275;
			var text = ('Everyone should check out the most #interactive website on the Internet.').replace('#', '%23');
			var via = 'andyawards';
			shareUrl = 'https://twitter.com/intent/tweet?original_referer=' + subjectUrl + '&url=' + subjectUrl + '&text=' + text + '&via=' + via;
			break;

			default:
			break;
		}

		var Popup = require('popup');
		var popup = new Popup(shareUrl, popupOptions);

		ga.event( {
			category: type,
			action: 'share',
			nonInteraction: false
		} );
	},

	renderFront: function() {

		var canvasHeading = this.props.useCanvasText ? (
			React.createElement(ShineCanvas, {color: "gold", text: this.props.title})
		) : null;

		var headingClassname = classnames('golden-heading', {
			'use-canvas': this.props.useCanvasText
		});		
		
		return (
			React.createElement("div", null, 

				React.createElement("h2", {className: headingClassname}, 
					React.createElement("span", {dangerouslySetInnerHTML: {__html: this.props.title}}), 
					canvasHeading
				), 

				React.createElement("div", {className: "icon icon-divider divider"}), 
				
				React.createElement("div", {className: "share-buttons"}, 
					React.createElement("button", {"data-type": "twitter", onClick: this.onClickShare}), 
					React.createElement("button", {"data-type": "facebook", onClick: this.onClickShare})
				)

			)
		);
	}
} );

module.exports = ShareSection;