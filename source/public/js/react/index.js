var _ = require( 'underscore' );
var Utils = require( '../helpers/utils' );
var React = require( 'react' );
var Layout = require( './layout' );
var MainContent = require( './maincontent' );


var Index = React.createClass( {displayName: "Index",

	render: function() {
		return (
			React.createElement(Layout, {
				sharingInfo: this.props.sharingInfo, 
				mobile: this.props.mobile, 
				phone: this.props.phone, 
				tablet: this.props.tablet, 
				debug: this.props.debug, 
				page: "main", 
				noScrollbar: true}, 
				
				React.createElement("script", {type: "application/json", id: "props", dangerouslySetInnerHTML: {__html: Utils.transformPropsToJSON(this.props)}}), 

				React.createElement("div", {id: "main-container"}, 
					React.createElement(MainContent, {
						ie: this.props.ie, 
						mobile: this.props.mobile, 
						phone: this.props.phone, 
						tablet: this.props.tablet, 
						imageSubmissions: this.props.imageSubmissions, 
						giphySubmissions: this.props.giphySubmissions, 
						videoSubmissions: this.props.videoSubmissions, 
						textSubmissions: this.props.textSubmissions, 
						tweetSubmissions: this.props.tweetSubmissions, 
						soundSubmissions: this.props.soundSubmissions, 
						chatHistory: this.props.chatHistory})
				)

			)
		);
	}
} );


module.exports = Index;