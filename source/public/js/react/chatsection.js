var _ = require( 'underscore' );
var React = require( 'react' );
var ReactDOM = require( 'react-dom' );
var classnames = require( 'classnames' );
var Scroller = require('./scroller');
var BaseSection = require( './basesection' );
var ShineCanvas = require( './fx/shinecanvas' );
var Input = require( './input' );
var Utils = require( '../helpers/utils' );
var pubSub = require( '../helpers/pubsub' );

var ga;

var ErrorMessage = {
	nameExisted: 'This name is already taken by another user. Try a different one.',
	exceedsNameLength: 'Please enter a shorter name.',
	exceedsMessageLength: 'Please enter a message with less than 140 characters.'
};

var ChatSection = React.createClass( {displayName: "ChatSection",

	socket: null,

	getDefaultProps: function() {

		return {
			useCanvas: ShineCanvas.shouldUseGL()
		}
	},

	getInitialState: function() {

		// sort chat history by ascending order
		var chatHistory = _.sortBy(this.props.chatHistory, function(item) {
			return item.timeCreated;
		});

		return {
			username: '',
			hasJoined: false,
			hasNameError: false,
			hasMessageError: false,
			message: '',
			chatHistory: chatHistory || [],
			numInitialChatHistory: (this.props.chatHistory ? this.props.chatHistory.length : 0),
			errorMessage: ''
		};
	},

	componentDidMount: function() {

		var socketController = require('controllers/socketcontroller')();
		var EVENTS = global.config.EVENTS;
		ga = require( 'react-ga' );

		this.socket = socketController.getSocketByNamespace( 'chat' );
		this.socket.on( EVENTS.NEW_MESSAGE_DISPATCHED_FROM_SERVER, this.onNewMessageDispatchedFromServer );

		// init view
		this.scrollToNewMessage();
	},

	componentDidUpdate: function( prevProps, prevState ) {

		if ( prevState.chatHistory !== this.state.chatHistory ) {
			this.scrollToNewMessage();
		}
	},

	setUsername: function( e ) {

		this.setState( {
			username: e.target.value
		} );
	},

	setMessage: function( e ) {

		this.setState( {
			message: e.target.value
		} );
	},

	messageIsEmpty: function() {

		return ( this.state.message.length === 0 );
	},

	join: function( e ) {

		if ( e ) {
			e.preventDefault();
		}
		
		if(this.state.username.length > 20) {

			this.setState({
				hasNameError: true,
				errorMessage: ErrorMessage.exceedsNameLength
			});

			return;
		}

		this.setState({

			username: Utils.removeTags(this.state.username.trim()),
			hasNameError: false

		}, function() {

			this.socket.emit( global.config.EVENTS.JOIN_REQUESTED, {
				'username': this.state.username
			}, this.onJoinRequestResponded );

		}.bind(this));
	},

	scrollToNewMessage: function() {

		this.refs.scroller.scrollToBottom();
	},

	beforeSend: function( e ) {

		if ( e ) {
			e.preventDefault();
		}
		
		if(this.state.message.length > 140) {

			this.setState({
				hasMessageError: true,
				errorMessage: ErrorMessage.exceedsMessageLength
			});

			return;

		}else {

			this.setState({

				message: Utils.removeTags(this.state.message.trim()),
				hasMessageError: false

			}, function() {

				pubSub.submissionToBePosted.dispatch( this.send );

			}.bind(this));
		}
	},

	send: function() {

		this.socket.emit( global.config.EVENTS.NEW_MESSAGE_SUBMIT_FROM_CLIENT, {
			'username': this.state.username,
			'message': this.state.message
		} );
	},

	createChatHistoryItem: function( item, index ) {

		var itemClassName = classnames( item.side, {
			'mine': item.mine,
			'pop': (index + 1 > this.state.numInitialChatHistory)
		} );

		return (
			React.createElement("li", {key: index, className: itemClassName}, 
				React.createElement("div", {className: "avatar"}), 
				React.createElement("div", {className: "message"}, 
					React.createElement("p", null, 
						React.createElement("span", {className: "username"}, item.username, ":"), 
						React.createElement("span", null, item.message)
					)
				)
			)
		);
	},

	onJoinRequestResponded: function(permitted) {

		if(permitted) {

			this.setState( {
				hasJoined: true
			}, function() {
				ReactDOM.findDOMNode(this.refs.messageInput).focus();
			}.bind(this) );

			console.log( "Join permitted!" );

		}else {

			this.setState( {
				hasNameError: true,
				errorMessage: ErrorMessage.nameExisted
			} );

			console.log( "Join rejected!" );
		}
	},

	onNewMessageDispatchedFromServer: function( data ) {

		var id = data[ 'id' ];
		var isMyMessage = ( id === this.socket.id );

		var _chatHistory = this.state.chatHistory.concat();
		_chatHistory.push( data );

		this.setState( {
			chatHistory: _chatHistory,
			message: isMyMessage ? '' : this.state.message
		} );

		if (isMyMessage) {
			ga.event( {
				category: 'chat',
				action: 'post',
				nonInteraction: false
			} );
		}
	},

	render: function() {

		var usernameControlsClassName = classnames( 'username-controls', {
			'hide': this.state.hasJoined
		} );

		var messageControlsClassName = classnames( 'message-controls', {
			'hide': !this.state.hasJoined
		} );

		// generate chat message info
		var side = 'left';
		var lastUsername;

		var chatItems = _.map(this.state.chatHistory, function(item) {

			var isMine = ( this.socket && item.id === this.socket.id );
			var username = item['username'];
			var message = item['message'];

			side = (lastUsername === username) ? side : (side === 'left' ? 'right' : 'left');
			lastUsername = username;
			
			return {
				side: side,
				mine: isMine,
				username: username,
				message: message
			};

		}, this);
		//

		var goldBackground = this.props.useCanvas ? (
			React.createElement(ShineCanvas, {color: "gold"})
		) : null;

		var silverBackground = this.props.useCanvas ? (
			React.createElement(ShineCanvas, {color: "silver"})
		) : null;

		var textPaneClassname = classnames('text-pane', {
			'use-canvas': this.props.useCanvas
		});

		var chatPaneClassname = classnames('chat-pane', {
			'use-canvas': this.props.useCanvas
		});

		var canJoin = (!this.state.hasJoined && this.state.username.length > 0);

		var nameErrorClassName = classnames('error', {
			'show': this.state.hasNameError
		});

		var messageErrorClassName = classnames('error', {
			'show': this.state.hasMessageError
		});

		return (
			React.createElement(BaseSection, {
				classNames: "chat"}, 

				React.createElement("div", {className: textPaneClassname}, 
					React.createElement("div", {className: "inner", ref: "textPaneInner"}, 
						goldBackground, 
						React.createElement("p", null, 
							React.createElement("span", null, "Join the perfect"), 
							React.createElement("br", null), 
							React.createElement("span", null, "interactive"), 
							React.createElement("br", null), 
							React.createElement("span", null, "conversation")
						)
					)
				), 

				React.createElement("div", {className: chatPaneClassname}, 
					React.createElement("div", {className: "inner"}, 
						React.createElement("div", {ref: "chatWindow", className: "chat-window"}, 
							silverBackground, 
							React.createElement(Scroller, {ref: "scroller"}, 
								React.createElement("ul", null, 
								chatItems.map( this.createChatHistoryItem)
								)
							)
						), 

						React.createElement("div", {className: usernameControlsClassName}, 
							React.createElement("form", {onSubmit: this.join}, 
								React.createElement(Input, {placeholder: "ENTER YOUR NAME TO JOIN", 
									editable: !this.state.hasJoined, html: this.state.username, onChange: this.setUsername}), 

								React.createElement("button", {className: "post-button", disabled: !canJoin, onClick: this.join}, "Join")
							), 
							React.createElement("div", {className: nameErrorClassName}, 
								React.createElement("span", {className: "icon icon-warning"}), 
								React.createElement("p", null, this.state.errorMessage)
							)
						), 

						React.createElement("div", {className: messageControlsClassName}, 
							React.createElement("form", {onSubmit: this.beforeSend}, 
								React.createElement(Input, {ref: "messageInput", placeholder: "LEAVE A MESSAGE", 
									editable: this.state.hasJoined, html: this.state.message, onChange: this.setMessage}), 

								React.createElement("button", {className: "post-button", disabled: this.messageIsEmpty(), onClick: this.beforeSend}, "Post")
							), 
							React.createElement("div", {className: messageErrorClassName}, 
								React.createElement("span", {className: "icon icon-warning"}), 
								React.createElement("p", null, this.state.errorMessage)
							)
						)
					)
				)

			)
		);
	}
} );

module.exports = ChatSection;