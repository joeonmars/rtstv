var _ = require( 'underscore' );
var Utils = require( '../helpers/utils' );
var React = require( 'react' );
var Layout = require( './layout' );
var MainContent = require( './maincontent' );


var Index = React.createClass( {displayName: "Index",

	render: function() {
		return (
			React.createElement(Layout, {
				pageId: 'reception', 
				cmsData: this.props.cmsData, 
				mobile: this.props.mobile, 
				phone: this.props.phone, 
				tablet: this.props.tablet, 
				debug: this.props.debug}, 
				
				React.createElement("script", {type: "application/json", id: "props", dangerouslySetInnerHTML: {__html: Utils.transformPropsToJSON(this.props)}}), 
				
				React.createElement("div", {id: "main-container"}, 
					React.createElement(MainContent, {
						sections: this.props.cmsData.sections, 
						mobile: this.props.mobile, 
						phone: this.props.phone, 
						tablet: this.props.tablet})
				)

			)
		);
	}
} );


module.exports = Index;