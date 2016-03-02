var _ = require( 'underscore' );
var Utils = require( '../helpers/utils' );
var React = require( 'react' );
var moment = require('moment');

var UrlPattern;
var submissionSocket;
var chatSocket;

var DataTable = React.createClass( {displayName: "DataTable",

	getInitialState: function() {

		// format props for display
		var submissions = this.props.submissions.map( function( item ) {
			var json = {
				id: item._id,
				type: item.type,
				content: item.content,
				cache: item.cache,
				scores: item.scores,
				appearances: item.appearances,
				timeCreated: moment.unix( item.timeCreated/1000 ).format('MM/DD/YYYY HH:mm:ss')
			};
			return json;
		} );

		submissions = JSON.parse( JSON.stringify( submissions ) );

		var chatHistory = this.props.chatHistory.map( function( item ) {
			var json = {
				id: item._id,
				username: item.username,
				message: item.message,
				timeCreated: moment.unix( item.timeCreated/1000 ).format('MM/DD/YYYY HH:mm:ss')
			};
			return json;
		} );

		chatHistory = JSON.parse( JSON.stringify( chatHistory ) );

		return {
			previews: {},
			submissions: submissions,
			chatHistory: chatHistory
		};
	},

	componentDidMount: function() {

		UrlPattern = require( 'url-pattern' );

		var socketController = require('controllers/socketcontroller')();
		submissionSocket = socketController.getSocketByNamespace( 'submission' );
		chatSocket = socketController.getSocketByNamespace( 'chat' );

		var uncachedSubmissions = [];
		var cachedPreviews = {};

		_.each( this.state.submissions, function(sub) {

			var uncached = sub.cache ? false : true;

			if(uncached) {

				uncachedSubmissions.push(sub);

			}else {

				cachedPreviews[sub.id] = sub.cache;
			}
		} );

		_.each(uncachedSubmissions, this.getPreview, this);

		this.setState({
			previews: cachedPreviews
		});
	},

	getPreview: function( submission ) {

		if(this.state.previews[submission.id]) {
			return;
		}

		var endpoint;
		
		switch(submission.type) {
			case 'image':
				var pattern = new UrlPattern( '(http(s)\\://)(www.)instagram.com/p/:shortcode(/*)' );
				var result = pattern.match( submission.content );
				var shortcode = result.shortcode;
				endpoint = global.config.SERVER_URL + '/instagram/' + shortcode;
				break;

			case 'video':
				var pattern = new UrlPattern( '(http(s)\\://)(www.)youtube.com/watch?v=:id' );
				var result = pattern.match( submission.content );
				endpoint = global.config.SERVER_URL + '/youtube/poster/' + result.id;
				break;

			case 'tweet':
				var pattern = new UrlPattern( '(http(s)\\://)twitter.com/:user/status/:id(/*)' );
				var result = pattern.match( submission.content );
				endpoint = global.config.SERVER_URL + '/tweet/' + result.id;
				break;

			default:
				return;
				break;
		}

		$.get(endpoint, function(result) {

			var url;

			switch(submission.type) {
				case 'image':
					url = result['url'];
					break;

				case 'video':
					url = result;
					break;

				case 'tweet':
					url = result['text'];
					break;

				default:
			}

			var nextPreviews = _.clone(this.state.previews);
			nextPreviews[submission.id] = url;

			submissionSocket.emit( global.config.EVENTS.SUBMISSION_CACHED_FROM_CLIENT, {
				submissionId: submission.id,
				cache: url
			} );

			this.setState({
				previews: nextPreviews
			});

		}.bind(this));
	},

	createSubmissionRow: function(data) {

		var preview;
		var link;

		switch(data.type) {
			case 'image':
			case 'video':
				preview = React.createElement("img", {src: this.state.previews[data.id]});
				link = React.createElement("a", {href: this.state.previews[data.id], target: "_blank"});
				break;

			case 'giphy':
				preview = React.createElement("img", {src: data.content});
				break;

			case 'tweet':
				preview = this.state.previews[data.id];
				link = React.createElement("a", {href: this.state.previews[data.id], target: "_blank"});
				break;

			default:
				break;
		}

		return (
			React.createElement("tr", {key: data.id}, 
				React.createElement("td", {className: "timestamp"}, data.timeCreated), 
				React.createElement("td", null, data.type), 
				React.createElement("td", null, 
					preview, 
					React.createElement("br", null), 
					link, 
					data.content
				), 
				React.createElement("td", null, 
					React.createElement("button", {"data-id": data.id, "data-type": "submission", 
						onClick: this.onClickRemoveButton}, "Remove")
				), 
				React.createElement("td", {className: "detail hidden"}, data.id), 
				React.createElement("td", {className: "detail hidden"}, data.scores), 
				React.createElement("td", {className: "detail hidden"}, data.appearances)
			)
		);
	},

	createChatHistoryRow: function(data) {

		return (
			React.createElement("tr", {key: data.id}, 
				React.createElement("td", null, data.timeCreated), 
				React.createElement("td", null, data.id), 
				React.createElement("td", null, data.username), 
				React.createElement("td", null, data.message), 
				React.createElement("td", null, 
					React.createElement("button", {"data-id": data.id, "data-type": "chat", 
						onClick: this.onClickRemoveButton}, "Remove")
				)
			)
		);
	},

	toggleDetail: function(e) {
		console.log(e.target);
		e.target.classList.toggle('expanded');
		var els = document.querySelectorAll('.detail');
		for (var i = 0; i < els.length; i++) {
			els[i].classList.toggle('hidden');
		}
	},

	onClickRemoveButton: function(e) {
		console.log(e.target);
		if (window.confirm('Are you sure to remove this item? This cannot be undone.')) {

			var id = e.target.getAttribute('data-id');
			var type = e.target.getAttribute('data-type');

			if(type === 'submission') {

				submissionSocket.emit( global.config.EVENTS.SUBMISSION_REMOVAL_REQUESTED_FROM_CLIENT, {
					'id': id
				}, this.onSubmissionRemovalResponded );

			}else if(type === 'chat') {

				chatSocket.emit( global.config.EVENTS.CHAT_REMOVAL_REQUESTED_FROM_CLIENT, {
					'id': id
				}, this.onChatRemovalResponded );
			}
		}
	},

	onSubmissionRemovalResponded: function( doc ) {

		var removedSubmission = _.find(this.state.submissions, function(sub) {
			return (sub.id === doc._id);
		});

		this.setState({
			submissions: _.without(this.state.submissions, removedSubmission)
		});
	},

	onChatRemovalResponded: function( doc ) {

		var removedChat = _.find(this.state.chatHistory, function(chat) {
			return (chat.id === doc._id);
		});

		this.setState({
			chatHistory: _.without(this.state.chatHistory, removedChat)
		});
	},

	render: function() {

		return (
			React.createElement("div", {id: "data-table"}, 
				React.createElement("h2", null, "Submissions"), 
				React.createElement("table", null, 
					React.createElement("tbody", null, 
						React.createElement("tr", null, 
							React.createElement("th", null, "Time Created"), 
							React.createElement("th", null, "Type"), 
							/*<th>Content</th>*/
							React.createElement("th", null, "Preview"), 
							React.createElement("th", null, "Action"), 
							React.createElement("th", {className: "detail hidden"}, "Id"), 
							React.createElement("th", {className: "detail hidden"}, "Scores"), 
							React.createElement("th", {className: "detail hidden"}, "Appearances"), 
							React.createElement("th", {className: "toggle-detail", "data-id": "toggle", "data-type": "toggle", onClick: this.toggleDetail})
						), 
						this.state.submissions.map(this.createSubmissionRow)
					)
				), 

				React.createElement("h2", null, "Chat History"), 
				React.createElement("table", null, 
					React.createElement("tbody", null, 
						React.createElement("tr", null, 
							React.createElement("th", null, "Time Created"), 
							React.createElement("th", null, "Id"), 
							React.createElement("th", null, "Username"), 
							React.createElement("th", null, "Message"), 
							React.createElement("th", null, "Action")
						), 
						this.state.chatHistory.map(this.createChatHistoryRow)
					)
				)
			)
		);
	}
} );


module.exports = DataTable;