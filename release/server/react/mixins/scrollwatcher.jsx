var React = require( 'react' );
var ReactDOM = require( 'react-dom' );


var mixins = {

	getInitialState: function() {

	    return {
	    	scrollWatchOffset: this.props.scrollWatchOffset || 0,
	    	enteredViewport: false,
	    	enteredViewportOnce: false,
	    	fullyEnteredViewport: false,
	    	fullyEnteredViewportOnce: false
	    };
	},

	componentDidMount: function() {

		var ScrollMonitor = require('scrollmonitor');
		var dom = ReactDOM.findDOMNode(this);

		this.scrollWatcher = ScrollMonitor.create( dom, {
			top: this.props.scrollWatchOffset
		} );
	},

	startScrollWatching: function() {

		this.scrollWatcher.on( 'enterViewport', this.onEnterViewport );
		this.scrollWatcher.on( 'fullyEnterViewport', this.onFullyEnterViewport );
		this.scrollWatcher.on( 'exitViewport', this.onExitViewport );
		this.scrollWatcher.on( 'partiallyExitViewport', this.onPartiallyExitViewport );
	},

	stopScrollWatching: function() {

		this.scrollWatcher.destroy();
	},

	onEnterViewport: function() {

		this.setState({
			enteredViewport: true,
			enteredViewportOnce: true
		});

		if(this.handleEnterViewport) {
			this.handleEnterViewport();
		}
	},

	onFullyEnterViewport: function() {

		this.setState({
			fullyEnteredViewport: true,
			fullyEnteredViewportOnce: true
		});

		if(this.handleFullyEnterViewport) {
			this.handleFullyEnterViewport();
		}
	},

	onExitViewport: function() {

		this.setState({
			enteredViewport: false,
			fullyEnteredViewport: false
		});

		if(this.handleExitViewport) {
			this.handleExitViewport();
		}
	},

	onPartiallyExitViewport: function() {

		this.setState({
			enteredViewport: false,
			fullyEnteredViewport: false
		});
	}
};


module.exports = mixins;