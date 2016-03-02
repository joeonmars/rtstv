var _ = require( 'underscore' );
var React = require( 'react' );
var classnames = require( 'classnames' );
var BaseSection = require( './basesection' );
var CollageSection = require( './collagesection' );
var PrimaryButton = require( './primarybutton' );


var blockTypeIndexes = {
	'text': 0,
	'giphy': 0,
	'video': 0,
	'tweet': 0,
	'image': 0
};

var scrollController;


var ExtendedSection = React.createClass( {displayName: "ExtendedSection",

	propTypes: {
	    submissions: React.PropTypes.object.isRequired
	},

	getInitialState: function() {

		return {
			showedAll: false,
			collages: []
		};
	},

	componentDidMount: function() {

		scrollController = require('controllers/scrollcontroller');

		this.submissions = _.clone( this.props.submissions );
	},

	createCollage: function( submissions, i ) {

		var layoutId = CollageSection.getLayoutIdByCount( i );

		return (
			React.createElement(CollageSection, {key: i, submissions: submissions, layoutId: layoutId})
		);
	},

	loadSubmissions: function() {

		// get current combination of types
		var combination = CollageSection.getCombinationAt( this.state.collages.length );

		// calculate and store the quantity for each type
		var typeQuantities = {};

		_.each( combination, function( type ) {
			typeQuantities[ type ] = ( typeQuantities[ type ] || 0 ) + 1;
		} );

		// figure out the range to query from DB,
		// note: the skip and limit are MongoDB queries
		var typeRanges = _.mapObject(typeQuantities, function(quantity, type) {
			var range = {
				skip: blockTypeIndexes[type],
				limit: quantity
			};

			blockTypeIndexes[type] += quantity;

			return range;
		});

		/*
		// send request to server
		var socketController = require('controllers/socketcontroller')();
		var socket = socketController.getSocketByNamespace( 'submission' );

		socket.emit( global.config.EVENTS.SUBMISSION_COMBINATION_REQUESTED_BY_CLIENT, {
			'ranges': typeRanges,
			'combination': combination
		}, this.onSubmissionCombinationRequestResponded );

		console.log( 'Request submissions of range: ', typeRanges, 'of combination: ', combination );
		*/

		// Do it on local data retrieved from DB now
		this.extractRequestedSubmissions( typeRanges, combination );
	},

	extractRequestedSubmissions: function( ranges, combination ) {

		var result = _.map( combination, function( type ) {

			var submission = this.submissions[type].shift();
			return submission;
		}, this );

		this.onSubmissionCombinationRequestResponded( result );
	},

	scrollToNewCollage: function() {

		scrollController.disableManualScroll();

		setTimeout( function() {

			var newCollageY = $(this.refs.submissionsContainer).children().last().offset().top;
			var scrollY = newCollageY - $(window).height() * 0.25;
			scrollController.scrollToAndLock( scrollY );

		}.bind(this), 500 );
	},

	onSubmissionCombinationRequestResponded: function( submissions ) {

		var _submissions = _.compact(submissions);

		if( _submissions.length === submissions.length ) {

			var newCollages = this.state.collages.concat().concat( [_submissions] );
			
			var self = this;

			this.setState({

				collages: newCollages

			}, function() {

				if(!global.props.mobile) {
					self.scrollToNewCollage();
				}
			});

		}else {

			this.setState({
				showedAll: true
			});

			console.log( 'No more submissions can show.' );
		}
	},

	render: function() {

		var loadButtonClassName = classnames('load-button', {
			'hide': this.state.showedAll
		});

		return (
			React.createElement(BaseSection, {
				classNames: "extended"}, 

				React.createElement("div", {className: "submissions-container", ref: "submissionsContainer"}, 
					this.state.collages.map( this.createCollage)
				), 

				React.createElement(PrimaryButton, {text: "View More Perfection", 
					classNames: loadButtonClassName, 
					onClick: this.loadSubmissions})

			)
		);
	}
} );

module.exports = ExtendedSection;