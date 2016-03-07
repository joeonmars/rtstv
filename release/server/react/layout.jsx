var React = require( 'react' );
var Header = require('./header');
var Footer = require('./footer');


var Layout = React.createClass( {

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

		var isDesktop = !this.props.mobile ? true : null;

		return (
			<html lang="en"
				data-desktop={isDesktop}
				data-mobile={this.props.mobile} data-phone={this.props.phone} data-tablet={this.props.tablet}>

				<head>
					<title>{this.props.cmsData.title}</title>
					
					<meta charSet="utf-8" />
					<meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
					<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1, minimum-scale=1, maximum-scale=1" />
					<meta name="description" content={this.props.cmsData.description} />

					<meta content={this.props.cmsData.meta.title} property="og:title" />
					<meta content={this.props.cmsData.meta.site_name} property="og:site_name" />
					<meta content={this.props.cmsData.meta.description} property="og:description" />
					<meta content="http://www.reuters.tv/about/img/og-image.jpg" property="og:image" />
					<meta content="website" property="og:type" />

					<link rel="apple-touch-icon-precomposed" sizes="57x57" href="images/misc/apple-touch-icon-57x57.png" />
					<link rel="apple-touch-icon-precomposed" sizes="114x114" href="images/misc/apple-touch-icon-114x114.png" />
					<link rel="apple-touch-icon-precomposed" sizes="72x72" href="images/misc/apple-touch-icon-72x72.png" />
					<link rel="apple-touch-icon-precomposed" sizes="144x144" href="images/misc/apple-touch-icon-144x144.png" />
					<link rel="apple-touch-icon-precomposed" sizes="60x60" href="images/misc/apple-touch-icon-60x60.png" />
					<link rel="apple-touch-icon-precomposed" sizes="120x120" href="images/misc/apple-touch-icon-120x120.png" />
					<link rel="apple-touch-icon-precomposed" sizes="76x76" href="images/misc/apple-touch-icon-76x76.png" />
					<link rel="apple-touch-icon-precomposed" sizes="152x152" href="images/misc/apple-touch-icon-152x152.png" />

					<link rel="stylesheet" href={cssPath} />
				</head>

				<body>
					<div id='main-header'>
						<Header currentNavId={this.props.pageId} />
					</div>
					
					{this.props.children}

					<div id='main-footer'>
						<Footer />
					</div>

					<script src={jsPath}></script>
				</body>
				
			</html>
		);
	}
	
} );

module.exports = Layout;