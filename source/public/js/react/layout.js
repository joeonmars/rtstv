var React = require( 'react' );
var Header = require('./header');
var Footer = require('./footer');


var Layout = React.createClass( {displayName: "Layout",

	getDefaultProps: function() {
		return {
			pageId: '',
			cssFileName: 'rtstv.css',
			cmsData: {},
			debug: false
		};
	},

	render: function() {

		var cssFileName = this.props.debug ? this.props.cssFileName.replace('.css', '.debug.css') : this.props.cssFileName;
		var cssPath = ( '/css/{filename}' ).replace( '{filename}', cssFileName );

		var jsPath = this.props.debug ? '/output/bundle.debug.js' : '/output/bundle.js';

		return (
			React.createElement("html", {lang: "en", 
				"data-desktop": !this.props.mobile, 
				"data-mobile": this.props.mobile, "data-phone": this.props.phone, "data-tablet": this.props.tablet}, 

				React.createElement("head", null, 
					React.createElement("title", null, this.props.cmsData.title), 
					
					React.createElement("meta", {charSet: "utf-8"}), 
					React.createElement("meta", {httpEquiv: "Content-Type", content: "text/html; charset=utf-8"}), 
					React.createElement("meta", {name: "viewport", content: "width=device-width, user-scalable=no, initial-scale=1, minimum-scale=1, maximum-scale=1"}), 
					React.createElement("meta", {name: "description", content: this.props.cmsData.description}), 

					React.createElement("meta", {content: this.props.cmsData.meta.title, property: "og:title"}), 
					React.createElement("meta", {content: this.props.cmsData.meta.site_name, property: "og:site_name"}), 
					React.createElement("meta", {content: this.props.cmsData.meta.description, property: "og:description"}), 
					React.createElement("meta", {content: "http://www.reuters.tv/about/img/og-image.jpg", property: "og:image"}), 
					React.createElement("meta", {content: "website", property: "og:type"}), 

					React.createElement("link", {rel: "apple-touch-icon-precomposed", sizes: "57x57", href: "images/misc/apple-touch-icon-57x57.png"}), 
					React.createElement("link", {rel: "apple-touch-icon-precomposed", sizes: "114x114", href: "images/misc/apple-touch-icon-114x114.png"}), 
					React.createElement("link", {rel: "apple-touch-icon-precomposed", sizes: "72x72", href: "images/misc/apple-touch-icon-72x72.png"}), 
					React.createElement("link", {rel: "apple-touch-icon-precomposed", sizes: "144x144", href: "images/misc/apple-touch-icon-144x144.png"}), 
					React.createElement("link", {rel: "apple-touch-icon-precomposed", sizes: "60x60", href: "images/misc/apple-touch-icon-60x60.png"}), 
					React.createElement("link", {rel: "apple-touch-icon-precomposed", sizes: "120x120", href: "images/misc/apple-touch-icon-120x120.png"}), 
					React.createElement("link", {rel: "apple-touch-icon-precomposed", sizes: "76x76", href: "images/misc/apple-touch-icon-76x76.png"}), 
					React.createElement("link", {rel: "apple-touch-icon-precomposed", sizes: "152x152", href: "images/misc/apple-touch-icon-152x152.png"}), 

					React.createElement("link", {rel: "stylesheet", href: cssPath})
				), 

				React.createElement("body", null, 
					React.createElement("div", {id: "main-header"}, 
						React.createElement(Header, {currentNavId: this.props.pageId})
					), 
					
					this.props.children, 

					React.createElement("div", {id: "main-footer"}, 
						React.createElement(Footer, null)
					), 

					React.createElement("script", {src: jsPath})
				)
				
			)
		);
	}
	
} );

module.exports = Layout;