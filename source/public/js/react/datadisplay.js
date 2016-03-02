var Utils = require( '../helpers/utils' );
var React = require( 'react' );
var DataTable = require( './datatable' );
var Layout = require( './layout' );

var DataDisplay = React.createClass( {displayName: "DataDisplay",

	render: function() {

		return (
			React.createElement(Layout, {sharingInfo: this.props.sharingInfo, page: "data", cssFileName: "adys-datadisplay.css"}, 
				
				React.createElement("script", {type: "application/json", id: "props", dangerouslySetInnerHTML: {__html: Utils.transformPropsToJSON(this.props)}}), 

				React.createElement("div", {id: "data-container"}, 
					React.createElement(DataTable, {
						submissions: this.props.submissions, 
						chatHistory: this.props.chatHistory})
				)

			)
		);
	}
} );


module.exports = DataDisplay;