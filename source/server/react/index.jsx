var _ = require( 'underscore' );
var Utils = require( '../helpers/utils' );
var React = require( 'react' );
var Layout = require( './layout' );
var MainContent = require( './maincontent' );


var Index = React.createClass( {

	render: function() {
		return (
			<Layout
				sharingInfo={this.props.sharingInfo}
				mobile={this.props.mobile}
				phone={this.props.phone}
				tablet={this.props.tablet}
				debug={this.props.debug}
				page='main'
				noScrollbar={true}>
				
				<script type='application/json' id='props' dangerouslySetInnerHTML={{__html: Utils.transformPropsToJSON(this.props)}} />

				<div id='main-container'>
					<MainContent
						ie={this.props.ie}
						mobile={this.props.mobile}
						phone={this.props.phone}
						tablet={this.props.tablet}
						imageSubmissions={this.props.imageSubmissions}
						giphySubmissions={this.props.giphySubmissions}
						videoSubmissions={this.props.videoSubmissions}
						textSubmissions={this.props.textSubmissions}
						tweetSubmissions={this.props.tweetSubmissions}
						soundSubmissions={this.props.soundSubmissions}
						chatHistory={this.props.chatHistory} />
				</div>

			</Layout>
		);
	}
} );


module.exports = Index;