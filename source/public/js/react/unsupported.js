var React = require( 'react' );
var Layout = require( './layout' );

var Unsupported = React.createClass( {displayName: "Unsupported",

	render: function() {
		return (
			React.createElement(Layout, {
				sharingInfo: this.props.sharingInfo, 
				mobile: this.props.mobile, 
				phone: this.props.phone, 
				tablet: this.props.tablet, 
				page: "unsupported"}, 

				React.createElement("div", {className: "landing"}, 
					React.createElement("div", {className: "marquee"}, 

						React.createElement("div", {className: "corners"}, 
							React.createElement("div", {className: "tl"}, 
								React.createElement("span", null, "A")
							), 
							React.createElement("div", {className: "tr"}, 
								React.createElement("span", null, "N")
							), 
							React.createElement("div", {className: "bl"}, 
								React.createElement("span", null, "D")
							), 
							React.createElement("div", {className: "br"}, 
								React.createElement("span", null, "Y")
							)
						), 

						React.createElement("div", {className: "inner"}, 
							React.createElement("div", {className: "upper"}, 
								React.createElement("div", {className: "logo"}, 
									React.createElement("div", {className: "icon icon-statue statue"}), 
									React.createElement("h2", null, "Beat the best and win an Andy.")
								)
							), 

							React.createElement("h3", null, "The website is perfect.", React.createElement("br", null), 'Your browser isn\'t.'), 

							React.createElement("div", {ref: "lower", className: "lower"}, 
								React.createElement("p", null, "Please upgrade your browser for the best experience."), 
								React.createElement("ul", null, 
									React.createElement("li", null, 
										React.createElement("a", {className: "icon icon-chrome", href: "https://www.google.com/chrome/browser/desktop/", title: "Google Chrome", target: "_blank"})
									), 
									React.createElement("li", null, 
										React.createElement("a", {className: "icon icon-ie", href: "http://windows.microsoft.com/en-us/internet-explorer/download-ie", title: "Internet Explorer", target: "_blank"})
									), 
									React.createElement("li", null, 
										React.createElement("a", {className: "icon icon-firefox", href: "https://www.mozilla.org/en-US/firefox/new/", title: "Mozilla Firefox", target: "_blank"})
									)
								)
							)
						)

					)
				)
				
			)
		);
	}
} );

module.exports = Unsupported;