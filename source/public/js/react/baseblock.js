var _ = require( 'underscore' );
var React = require( 'react' );
var classnames = require( 'classnames' );
var PrimaryButton = require( './primarybutton' );
var ScrollWatcher = require('./mixins/scrollwatcher');
var pubSub = require( '../helpers/pubsub' );
var Utils = require( '../helpers/utils' );

var ga;
var socket;
var key;

var ErrorMessage = {
	'private': 'This is a private link. Try using a public one instead.',
	'invalid': 'Please enter a valid URL.'
};

// A collection of already posted contents
var postedContents = [];

// A collection of already liked contents
var likedContents = [];


var mixins = {

	getDefaultProps: function() {

		return {
			handleAnimatedIn: Utils.nullFunction
		};
	},

	getInitialState: function() {

		return {
			submissionId: this.props.submissionId,
			content: this.props.content,
			tempContent: this.props.content,
			inEdit: false,
			inEditOnce: false,
			isNewlyCreatedSubmission: false,
			loaded: false,
			liked: false,
			contentEmptied: false,
			validated: false,
			errorMessage: ''
		};
	},

	componentDidMount: function() {

		key = require('keymaster');

		var socketController = require('controllers/socketcontroller')();
		socket = socketController.getSocketByNamespace( 'submission' );
		socket.on( global.config.EVENTS.SUBMISSION_REMOVED_FROM_SERVER, this.onSubmissionRemovedFromServer, this );

		ga = require( 'react-ga' );

		pubSub.anyContentLiked.add( this.onAnyContentLiked, this );
	},

	getCurrentContent: function() {

		var currentContent = this.state.inEdit ? this.state.tempContent : this.state.content;
		return currentContent;
	},

	toggleEdit: function() {

		var willBeInEdit = !this.state.inEdit;

		this.setState( {
			inEdit: willBeInEdit,
			inEditOnce: willBeInEdit ? true : this.state.inEditOnce,
			tempContent: willBeInEdit ? this.state.content : this.state.tempContent,
			errorMessage: willBeInEdit ? '' : this.state.errorMessage,
			validated: willBeInEdit ? false : this.state.validated,
			contentEmptied: willBeInEdit ? false : this.state.contentEmptied
		} );

		if(willBeInEdit) {
			key.setScope('block');
			key('esc', 'block', this.cancelEdit);
		}else {
			key.unbind('esc', 'block');
		}
	},

	confirmEdit: function(e) {

		if(e) {
			e.preventDefault();
		}

		if(this.state.tempContent === this.state.content) {
			this.cancelEdit();
			return;
		}

		pubSub.submissionToBePosted.dispatch( this.validateAfterConfirm );
	},

	cancelEdit: function() {

		this.setState( {
			inEdit: false,
			content: this.state.content
		} );
	},

	trackEdit: function() {

		ga.event( {
			category: this.props.type,
			action: 'edit',
			nonInteraction: false
		} );
	},

	setTempContent: function( e ) {

		this.setState( {
			tempContent: e.target.value,
			contentEmptied: (e.target.value.length === 0)
		} );
	},

	validateAfterConfirm: function() {

		if( this.validateTempContent ) {

			this.validateTempContent();

		}else {

			this.setValidationResult( this.state.tempContent );
		}
	},

	setValidationResult: function( result, opt_error_key ) {

		var validated = _.isString(result);

		var state = {
			validated: validated,
			errorMessage: opt_error_key ? ErrorMessage[ opt_error_key ] : ''
		};

		var onStateSet = validated ? this.sendSubmissionToServer : null;

		if(validated) {

			_.extend( state, {
				inEdit: false,
				content: Utils.removeTags(result)
			});
		}

		this.setState( state, onStateSet );
	},

	sendSubmissionToServer: function( opt_data ) {

		// When content is changed,
		// send it through server with status information for submission handlings on the backend
		var submissionId = this.state.submissionId;
		
		var payload = {
			type: this.props.type,
			content: this.state.content
		};

		if( this.state.isNewlyCreatedSubmission ) {
			_.extend( payload, {
				submissionId: submissionId,
				isNew: true
			});
		}

		if( BaseBlock.contentAlreadyPosted( this.state.content ) ) {
			_.extend( payload, {
				contentAlreadyPosted: true
			});
		}

		if(opt_data) {
			_.extend( payload, opt_data );
		}

		socket.emit( global.config.EVENTS.SUBMISSION_SENT_FROM_CLIENT, payload,
			this.onSubmissionReturnedFromServer );
	},

	cacheSubmissionToServer: function( cache ) {

		// Send the block media as cached content to the server
		var submissionId = this.state.submissionId;
		
		var payload = {
			submissionId: submissionId,
			cache: cache
		};

		socket.emit( global.config.EVENTS.SUBMISSION_CACHED_FROM_CLIENT, payload );
	},

	onLiked: function() {

		BaseBlock.storeContentAsLiked( this.state.content );

		this.setState({
			liked: true
		});

		var payload = {
			submissionId: this.state.submissionId
		};

		socket.emit( global.config.EVENTS.SUBMISSION_LIKED_FROM_CLIENT, payload );

		ga.event( {
			category: this.props.type,
			action: 'like',
			nonInteraction: false
		} );
	},

	onAnyContentLiked: function() {

		if(BaseBlock.contentAlreadyLiked(this.state.content)) {

			this.setState({
				liked: true
			});
		}
	},

	onSubmissionRemovedFromServer: function( removedDoc ) {

		// Will receive this callback from server,
		// if any submission was newly created and gotten removed from DB
		// due to submitting an exisiting content.
		// If the removed submission id is the same of this submission,
		// consider this has been a newly created submission that should persist in DB,
		// and re-submit this submission to server
		if(removedDoc._id === this.state.submissionId) {

			this.sendSubmissionToServer({
				scores: removedDoc.scores
			});
		}
	},

	onSubmissionReturnedFromServer: function( doc, newlyCreated ) {

		console.log( 'Submission %s returned from server.', doc._id, doc );

		// Only allow one like for each single content
		var liked = BaseBlock.contentAlreadyLiked( doc.content );

		var state = {
			submissionId: doc._id,
			liked: liked,
			isNewlyCreatedSubmission: newlyCreated,
			cache: doc.cache
		};

		this.setState( state );

		BaseBlock.storeContentAsPosted( doc.content );
	}
};


var BaseBlock = React.createClass( {displayName: "BaseBlock",

	mixins: [ ScrollWatcher ],

	statics: {
		getMixins: function() {
			
			return mixins;
		},

		storeContentAsPosted: function( content ) {

			if(_.indexOf(postedContents, content) === -1) {
				postedContents.push( content );
			}
		},

		contentAlreadyPosted: function( content ) {

			return _.contains( postedContents, content );
		},

		storeContentAsLiked: function( content ) {

			if(_.indexOf(likedContents, content) === -1) {

				likedContents.push( content );
				pubSub.anyContentLiked.dispatch( content );
			}
		},

		contentAlreadyLiked: function( content ) {

			return _.contains( likedContents, content );
		},
	},

	getDefaultProps: function() {

	    return {
	    	showEditOverlay: true,
	    	errorMessage: '',
	    	loaded: false
	    };
	},

	getInitialState: function() {

	    return {
	    	animatedIn: false,
	    	animatedInOnce: false
	    };
	},

	componentDidMount: function() {
	      
		this.startScrollWatching();
	},

	handleEnterViewport: function() {

		this.stopScrollWatching();

		this.setState({

			animatedIn: true,
			animatedInOnce: true

		}, this.props.handleAnimatedIn);
	},

	render: function() {

		var blockClassName = classnames( 'block', this.props.type, {
			'edit': this.props.inEdit,
			'loaded': this.props.loaded,
			'animate-in': this.state.animatedIn,
			'animate-in-once': this.state.animatedInOnce
		} );

		var editOverlayClassName = classnames( 'edit-overlay', {
			'show': (this.props.inEdit && this.props.showEditOverlay)
		} );

		var likeButtonClassName = classnames( 'icon icon-heart like-button', {
			'liked': this.props.liked
		} );

		return (
			React.createElement("div", {className: blockClassName}, 

				React.createElement("div", {className: "inner"}, 
					React.createElement("div", {className: "controls"}, 

						React.createElement("button", {className: "icon icon-edit edit-button", 
							onClick: this.props.toggleEdit}), 

						React.createElement("button", {className: likeButtonClassName, disabled: this.props.liked, 
							onClick: this.props.onLiked})

					), 

					this.props.children, 

					React.createElement("div", {className: editOverlayClassName}, 
						React.createElement("div", {className: "curtain"}), 

						React.createElement("div", {className: "edit-controls"}, 
							React.createElement("div", null, 
								this.props.editInput
							), 
							React.createElement("span", {className: "error"}, this.props.errorMessage), 
							React.createElement(PrimaryButton, {text: "Post", size: "sm", disabled: this.props.contentEmptied, onClick: this.props.confirmEdit})
						), 

						React.createElement("button", {className: "icon icon-no close-button", onClick: this.props.cancelEdit})
					)
				)

			)
		);
	}
} );


module.exports = BaseBlock;