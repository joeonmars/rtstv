var _ = require( 'underscore' );
var React = require( 'react' );
var Layout = require( './layout' );

var Share = React.createClass( {displayName: "Share",

	transformPropsToJSON: function() {

		var obj = _.omit( this.props, 'children' );

		var str = JSON.stringify( obj );
		return str;
	},

	render: function() {
		return (
			React.createElement(Layout, {sharingInfo: this.props.sharingInfo, page: "share"}, 

				React.createElement("script", {type: "application/json", id: "props", dangerouslySetInnerHTML: {__html: this.transformPropsToJSON()}})

			)
		);
	}
} );

module.exports = Share;