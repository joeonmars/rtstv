var React = require( 'react' );
var ReactDOM = require( 'react-dom' );
var classnames = require( 'classnames' );
var PrimaryButton = require( './primarybutton' );
var pubSub = require( '../helpers/pubsub' );

var scrollController;

var ConsentOverlay = React.createClass( {displayName: "ConsentOverlay",

	getInitialState: function() {

		return {
			checked: false,
			completed: false
		};
	},

	componentDidMount: function() {

		scrollController = require('controllers/scrollcontroller');

		this.onCompleteCallback = null;
		this.dom = ReactDOM.findDOMNode(this);

		pubSub.submissionToBePosted.add( this.onSubmissionToBePosted, this );
	},

	animateIn: function() {

		this.setState({
			checked: false
		});

		TweenMax.fromTo(this.dom, .25, {
			opacity: 0
		},{
			opacity: 1,
			display: 'block'
		});

		TweenMax.fromTo(this.refs.form, .5, {
			scale: .8,
			opacity: 0
		}, {
			delay: .15,
			scale: 1,
			opacity: 1,
			ease: Quint.easeOut,
			clearProps: 'all'
		});

		scrollController.disableManualScroll();
	},

	animateOut: function( onCompleteCallback ) {

		TweenMax.to(this.refs.form, .25, {
			scale: .8,
			opacity: 0,
			ease: Quint.easeOut
		});

		TweenMax.to(this.dom, .25, {
			delay: .15,
			opacity: 0,
			display: 'none',
			onComplete: onCompleteCallback
		});

		scrollController.enableManualScroll();
	},

	onCheckboxChange: function(e) {

		this.setState({
			checked: !this.state.checked
		});
	},

	onFormSubmit: function(e) {

		e.preventDefault();

		if(!this.state.completed && this.state.checked) {

			this.setState({
				completed: true
			});

			this.animateOut( this.onCompleteCallback );
		}
	},

	onClickDeclineButton: function(e) {

		e.preventDefault();

		this.animateOut();
	},

	onSubmissionToBePosted: function( callback ) {

		this.onCompleteCallback = callback;

		if(this.state.completed) {
			this.onCompleteCallback();
			return;
		}

		this.animateIn();
	},

	render: function() {

		var checkboxClassName = classnames('checkbox', {
			'checked': this.state.checked
		});

		var terms = (
			React.createElement("a", {className: "text-link", href: "https://www.andyawards.com/terms-conditions/", target: "_blank"}, "terms")
		);

		return (
			React.createElement("div", {id: "consent-overlay"}, 
				React.createElement("div", {className: "inner"}, 
					React.createElement("form", {ref: "form", onSubmit: this.onFormSubmit}, 
						React.createElement("div", {className: checkboxClassName}, 
							React.createElement("input", {type: "checkbox", defaultChecked: this.state.checked, onChange: this.onCheckboxChange}), 
							React.createElement("label", {className: "icon icon-yes"})
						), 
						React.createElement("p", null, "This website’s tone of voice is so perfect, you have no idea you’re reading legal copy right now.", React.createElement("br", null), React.createElement("br", null), "Check the box to agree to our ", terms, "."), 
						React.createElement("div", {className: "button-container"}, 
							React.createElement(PrimaryButton, {text: "Agree", disabled: !this.state.checked, onClick: this.onFormSubmit}), 
							React.createElement(PrimaryButton, {text: "Decline", onClick: this.onClickDeclineButton})
						)
					)
				)
			)
		);
	}

} );

module.exports = ConsentOverlay;