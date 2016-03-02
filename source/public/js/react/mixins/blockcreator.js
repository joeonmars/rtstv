var React = require( 'react' );
var TextBlock = require( '../textblock' );
var VideoBlock = require( '../videoblock' );
var TweetBlock = require( '../tweetblock' );
var ImageBlock = require( '../imageblock' );
var GiphyBlock = require( '../giphyblock' );


var blockMapping = {
	'text': TextBlock,
	'tweet': TweetBlock,
	'video': VideoBlock,
	'image': ImageBlock,
	'giphy': GiphyBlock
};


var mixins = {

	componentDidMount: function() {

		// inform server of submission appearances
		var socketController = require('controllers/socketcontroller')();
		var socket = socketController.getSocketByNamespace( 'submission' );

		var initialSubmissionIds = _.map(this.props.submissions, function(sub) {
			return sub._id;
		});

		socket.emit( global.config.EVENTS.SUBMISSIONS_APPEARED_FROM_CLIENT, {
			'submissionIds': initialSubmissionIds
		} );
	},

	createBlock: function( submission ) {

		var BlockComponent = blockMapping[ submission.type ];

		return (
			React.createElement(BlockComponent, {key: submission._id, 
				submissionId: submission._id, 
				type: submission.type, 
				content: submission.content, 
				appearances: submission.appearances, 
				scores: submission.scores, 
				timeCreated: submission.timeCreated, 
				cache: submission.cache})
		);
	}
};


module.exports = mixins;