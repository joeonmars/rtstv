var React = require( 'react' );
var classnames = require( 'classnames' );
var ScrollWatcher = require('./mixins/scrollwatcher');


var BaseSection = React.createClass( {displayName: "BaseSection",

	mixins: [ ScrollWatcher ],

	getDefaultProps: function() {

	    return {
	    	classNames: '',
	    	killScrollWatchOnEnter: false,
	    	scrollWatchOffset: 0,
	    	handleEnterViewport: null,
	    	handleFullyEnterViewport: null,
	    	handleExitViewport: null
	    };
	},

	componentDidMount: function() {

		this.startScrollWatching();
	},

	handleEnterViewport: function() {

		if(this.props.watchScrollOnce) {
			this.stopScrollWatching();
		}

		if(this.props.handleEnterViewport) {
			this.props.handleEnterViewport();
		}
	},

	handleFullyEnterViewport: function() {

		if(this.props.handleFullyEnterViewport) {
			this.props.handleFullyEnterViewport();
		}
	},

	handleExitViewport: function() {

		if(this.props.handleExitViewport) {
			this.props.handleExitViewport();
		}
	},

	render: function() {

		var sectionClassName = classnames( this.props.classNames, {
			'animate-in': this.state.enteredViewport,
			'animate-in-once': this.state.enteredViewportOnce,
			'animate-in-fully': this.state.fullyEnteredViewport,
			'animate-in-fully-once': this.state.fullyEnteredViewportOnce
		} );

		return (
			React.createElement("section", {className: sectionClassName}, 

				React.createElement("div", {className: "inner"}, 
					this.props.children
				)

			)
		);
	}
} );


module.exports = BaseSection;