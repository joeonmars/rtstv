var React = require( 'react' );
var Events = require( '../helpers/events' );
var classnames = require( 'classnames' );
var _ = require( 'underscore' );
var Header = require( './header' );

var Layout = React.createClass( {displayName: "Layout",

	getDefaultProps: function() {
		return {
			page: "",
			cssFileName: "adys.css",
			noScrollbar: false,
			debug: false
		};
	},

	createConfig: function() {

		var obj = {
			SERVER_URL: GLOBAL.SERVER_URL,
			WS_URI: GLOBAL.WS_URI,
			EVENTS: Events
		};

		var str = JSON.stringify( obj );
		return str;
	},

	render: function() {

		var cssPath = ( "/css/{filename}" ).replace( "{filename}", this.props.cssFileName );

		var debuggerStyle = {
			position: 'fixed',
			top: 0,
			left: 0,
			zIndex: 1000,
			padding: '10px',
			background: 'white',
			color: 'black',
			fontSize: '2rem',
			display: 'none'
		};

		var htmlClassNames = classnames({
			'no-scrollbar': this.props.noScrollbar
		});

		var appJs = this.props.debug ? "/output/bundle.debug.js" : "/output/bundle.js";

		return (
			React.createElement("html", {lang: "en", 
				className: htmlClassNames, 
				"data-desktop": !this.props.mobile, 
				"data-mobile": this.props.mobile, "data-phone": this.props.phone, "data-tablet": this.props.tablet}, 

				React.createElement("head", null, 

					React.createElement("title", null, this.props.sharingInfo.title), 
					
					React.createElement("meta", {charSet: "utf-8"}), 
					React.createElement("meta", {httpEquiv: "Content-Type", content: "text/html; charset=utf-8"}), 
					React.createElement("meta", {name: "viewport", content: "width=device-width, user-scalable=no, initial-scale=1, minimum-scale=1, maximum-scale=1"}), 
					React.createElement("meta", {name: "description", content: "If you don’t leave the metadata for the very end and then forget about it entirely, you can win an ANDY."}), 

					React.createElement("meta", {content: this.props.sharingInfo.title, property: "og:title"}), 
					React.createElement("meta", {content: this.props.sharingInfo.url, property: "og:url"}), 
					React.createElement("meta", {content: this.props.sharingInfo.description, property: "og:description"}), 
					React.createElement("meta", {content: this.props.sharingInfo.image, property: "og:image"}), 

					React.createElement("link", {rel: "apple-touch-icon-precomposed", sizes: "57x57", href: "images/misc/apple-touch-icon-57x57.png"}), 
					React.createElement("link", {rel: "apple-touch-icon-precomposed", sizes: "114x114", href: "images/misc/apple-touch-icon-114x114.png"}), 
					React.createElement("link", {rel: "apple-touch-icon-precomposed", sizes: "72x72", href: "images/misc/apple-touch-icon-72x72.png"}), 
					React.createElement("link", {rel: "apple-touch-icon-precomposed", sizes: "144x144", href: "images/misc/apple-touch-icon-144x144.png"}), 
					React.createElement("link", {rel: "apple-touch-icon-precomposed", sizes: "60x60", href: "images/misc/apple-touch-icon-60x60.png"}), 
					React.createElement("link", {rel: "apple-touch-icon-precomposed", sizes: "120x120", href: "images/misc/apple-touch-icon-120x120.png"}), 
					React.createElement("link", {rel: "apple-touch-icon-precomposed", sizes: "76x76", href: "images/misc/apple-touch-icon-76x76.png"}), 
					React.createElement("link", {rel: "apple-touch-icon-precomposed", sizes: "152x152", href: "images/misc/apple-touch-icon-152x152.png"}), 

					React.createElement("link", {rel: "stylesheet", href: cssPath}), 

					React.createElement("script", {src: "https://use.typekit.net/opm5cpp.js"}), 
					React.createElement("script", {dangerouslySetInnerHTML: {__html: 'try{Typekit.load({ async: false, active: function() {window.fontLoaded=true;} });}catch(e){}'}})

				), 

				React.createElement("body", {"data-page": this.props.page}, 
					React.createElement("div", {className: "debugger", style: debuggerStyle}, 
						"data-desktop: ", !this.props.mobile, React.createElement("br", null), 
						"data-mobile: ", this.props.mobile, React.createElement("br", null), 
						"data-phone: ", this.props.phone, React.createElement("br", null), 
						"data-tablet: ", this.props.tablet
					), 
					React.createElement("div", {id: "header-container"}, 
						React.createElement(Header, null)
					), 

					this.props.children, 

					React.createElement("script", {type: "application/json", id: "config", dangerouslySetInnerHTML: {__html: this.createConfig()}}), 
					
					React.createElement("script", {src: appJs})
					
				)
				
			)
		);
	}
} );

module.exports = Layout;