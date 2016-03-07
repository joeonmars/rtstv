var _ = require( 'underscore' );
var Utils = require( '../helpers/utils' );
var React = require( 'react' );
var Layout = require( './layout' );
var MainContent = require( './maincontent' );


var Index = React.createClass( {

	render: function() {
		return (
			<Layout
				pageId={this.props.pageId}
				cmsData={this.props.cmsData}
				mobile={this.props.mobile}
				phone={this.props.phone}
				tablet={this.props.tablet}
				debug={this.props.debug}>
				
				<script type='application/json' id='props' dangerouslySetInnerHTML={{__html: Utils.transformPropsToJSON(this.props)}} />
				
				<div id='main-container'>
					<MainContent
						sections={this.props.cmsData.sections}
						mobile={this.props.mobile}
						phone={this.props.phone}
						tablet={this.props.tablet} />
				</div>

			</Layout>
		);
	}
} );


module.exports = Index;