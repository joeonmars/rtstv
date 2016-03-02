var _ = require( 'underscore' );
var React = require( 'react' );
var classnames = require( 'classnames' );
var Utils = require( '../helpers/utils' );


var scrollController;


var Scroller = React.createClass( {displayName: "Scroller",

	getDefaultProps: function() {

		return {
			className: 'scroller',
			onScrolledToTop: Utils.nullFunction,
			onScrolledToBottom: Utils.nullFunction
		};
	},

	getInitialState: function() {

		return {
			scrollHeight: 0,
			handleHeight: 0,
			scrollRatio: 0,
			noScroll: false
		};
	},

	componentDidMount: function() {

		scrollController = require('controllers/scrollcontroller');

		$(this.refs.view)
			.on('scroll', this.onScrollView)
			.on('mousewheel', this.onMouseWheel)
			.on('mouseenter', this.onMouseEnterView)
			.on('mouseleave', this.onMouseLeaveView);

		$(this.refs.handle).on('mousedown', this.onMouseDownHandle);

		this.dragging = false;
		this.dragStartMouseY = 0;
		this.dragStartHandleY = 0;

		$(window).on('resize', this.resize);
		this.resize();
	},

	componentWillUnmount: function() {

		this.cancelDrag();

		$(window).off('resize', this.resize);
		$(this.refs.handle).off();
		$(this.refs.view).off();
	},

	resize: function() {

		var viewHeight = $(this.refs.view).height();
		var viewScrollHeight = this.refs.view.scrollHeight;
		var viewRatio = viewHeight / viewScrollHeight;

		this.setState({
			scrollHeight: this.refs.view.scrollHeight,
			handleHeight: Math.round(viewRatio * 100) + '%',
			noScroll: (viewHeight >= viewScrollHeight)
		});
	},

	scrollToBottom: function() {

		this.refs.view.scrollTop = this.refs.view.scrollHeight;
	},

	scrollTo: function( scrollTop ) {

		this.refs.view.scrollTop = scrollTop;
	},

	scrolledToTop: function() {

		var reachedTop = (this.refs.view.scrollTop <= 0);
		return reachedTop;
	},

	scrolledToBottom: function() {

		var viewHeight = $(this.refs.view).height();
		var reachedBottom = (this.refs.view.scrollTop + 1 >= this.refs.view.scrollHeight - viewHeight);
		return reachedBottom;
	},

	cancelDrag: function() {

		this.dragging = false;

		$(document)
			.off('mousemove', this.onDragHandle)
			.off('mouseup', this.cancelDrag);

		$('html').toggleClass('dragging', false);
	},

	onScrollView: function(e) {

		if(e.target.scrollHeight !== this.state.scrollHeight) {
			this.resize();
		}

		if(this.scrolledToTop()) {
			this.props.onScrolledToTop();
		}

		if(this.scrolledToBottom()) {
			this.props.onScrolledToBottom();
		}

		// update scrollbar position
		this.setState({
			scrollRatio: this.refs.view.scrollTop / this.refs.view.scrollHeight
		});
	},

	onMouseWheel: function(e) {

		if( (e.deltaY > 0 && this.scrolledToTop()) || (e.deltaY < 0 && this.scrolledToBottom()) ) {

			e.preventDefault();
		}
	},

	onMouseEnterView: function(e) {

		if ( scrollController.canSmoothScroll ) {
			scrollController.disableSmoothScroll();
		}
	},

	onMouseLeaveView: function(e) {

		if ( scrollController.canSmoothScroll ) {
			scrollController.enableSmoothScroll();
		}
	},

	onMouseDownHandle: function(e) {

		if(this.dragging) {
			return;
		}

		var handlePageY = $(this.refs.handle).offset().top;
		var trackPageY = $(this.refs.track).offset().top;

		this.dragStartMouseY = e.pageY;
		this.dragStartHandleY = handlePageY - trackPageY;

		$(document)
			.on('mousemove', this.onDragHandle)
			.on('mouseup', this.cancelDrag);

		$('html').toggleClass('dragging', true);
	},

	onDragHandle: function(e) {

		this.dragging = true;

		var draggedDist = e.pageY - this.dragStartMouseY;
		var draggedHandleY = this.dragStartHandleY + draggedDist;

		var handleHeight = $(this.refs.handle).height();
		var trackHeight = $(this.refs.track).height();
		var minY = 0;
		var maxY = trackHeight - handleHeight;

		draggedHandleRatio = Utils.clamp(draggedHandleY, minY, maxY) / maxY;

		var scrollableDist = this.refs.view.scrollHeight - $(this.refs.view).height();
		this.scrollTo( scrollableDist * draggedHandleRatio );
	},

	render: function() {

		var scrollerStyle = {
			position: 'relative',
			width: '100%',
			height: '100%',
			overflow: 'hidden'
		};

		var viewStyle = {
			position: 'absolute',
			zIndex: 0,
			width: '100%',
			height: '100%',
			paddingRight: '50px',
			overflow: 'auto',
			WebkitOverflowScrolling: 'touch'
		};

		var trackStyle = {
			position: 'absolute',
			visibility: this.state.noScroll ? 'hidden' : 'inherit',
			zIndex: 1,
			width: '10px',
			height: '100%',
			top: 0,
			right: 0
		};

		var handleStyle = {
			position: 'relative',
			width: '100%',
			height: this.state.handleHeight,
			top: Math.round(this.state.scrollRatio * 100) + '%'
		};

		return (
			React.createElement("div", {className: this.props.className, style: scrollerStyle}, 
			
				React.createElement("div", {className: "track", ref: "track", style: trackStyle}, 
					React.createElement("div", {className: "handle", ref: "handle", style: handleStyle})
				), 

				React.createElement("div", {className: "view", ref: "view", style: viewStyle}, 
				this.props.children
				)

			)
		);
	}
} );

module.exports = Scroller;