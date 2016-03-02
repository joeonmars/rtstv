var React = require( 'react' );
var Layout = require( './layout' );

var NotFound = React.createClass( {displayName: "NotFound",

	render: function() {
		return (
			React.createElement(Layout, {
				sharingInfo: this.props.sharingInfo, 
				mobile: this.props.mobile, 
				phone: this.props.phone, 
				tablet: this.props.tablet, 
				page: "error"}, 

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

							React.createElement("h3", null, "Even our 404 error page is", React.createElement("br", null), "a well-designed masterpiece."), 

							React.createElement("div", {ref: "lower", className: "lower"}
							)
						)

					)
				)
				
			)
		);
	}
} );

module.exports = NotFound;