var React = require( 'react' );
var ReactDOM = require( 'react-dom' );
var classnames = require( 'classnames' );


var BaseSection = React.createClass( {

	getDefaultProps: function() {

		var nullFunction = (function() {});

	    return {
	    	id: '',
	    	outer: null,
	    	scrollWatchOffset: 0,
	    	handleEnteredViewport: nullFunction,
	    	handleExitViewport: nullFunction,
	    	handleEnteredViewportOnce: nullFunction
	    };
	},

	getInitialState: function() {

	    return {
	    	enteredViewport: false,
	    	enteredViewportOnce: false
	    };
	},

	componentDidMount: function() {

		var ScrollMonitor = require('scrollmonitor');
		var sectionEl = ReactDOM.findDOMNode(this);

		this.scrollWatcher = ScrollMonitor.create( sectionEl, {
			top: this.props.scrollWatchOffset
		} );

		this.startScrollWatching();
	},

	startScrollWatching: function() {

		this.scrollWatcher.on( 'enterViewport', this.onEnterViewport );
		this.scrollWatcher.on( 'exitViewport', this.onExitViewport );
	},

	onEnterViewport: function() {

		var willEnterOnce = !this.state.enteredViewportOnce;

		this.setState({

			enteredViewport: true,
			enteredViewportOnce: true

		}, function() {

			this.props.handleEnteredViewport();

			if(willEnterOnce) {
				this.props.handleEnteredViewportOnce();
			}

		}.bind(this));
	},

	onExitViewport: function() {

		this.setState({
			enteredViewport: false
		}, this.props.handleExitViewport);
	},

	render: function() {

		var sectionClassName = classnames({
			'entered-viewport': this.state.enteredViewport,
			'entered-viewport-once': this.state.enteredViewportOnce
		});

		var outer = this.props.outer ? (
			<div className='outer'>
			{this.props.outer}
			</div>
		) : null;

		return (
			<section id={this.props.id} className={sectionClassName}>
				<div className='container'>
					<div className='inner'>
					{this.props.children}
					</div>

					{outer}
				</div>
			</section>
		);
	}
} );


module.exports = BaseSection;