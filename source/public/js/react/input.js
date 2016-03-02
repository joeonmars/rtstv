var React = require( 'react' );
var ReactDOM = require( 'react-dom' );
var _ = require( 'underscore' );
var Utils = require( '../helpers/utils' );


var Input = React.createClass( {displayName: "Input",

	getDefaultProps: function() {
		return {
			placeholder: 'Enter your text here.',
			html: ''
		};
	},

	componentDidMount: function() {

		this.dom = ReactDOM.findDOMNode(this);
	},

	shouldComponentUpdate: function( nextProps ) {

		return ( nextProps.html !== this.dom.value || nextProps.editable !== this.props.editable );
	},

	componentDidUpdate: function() {

		if ( this.props.html !== this.dom.value ) {
			this.dom.value = this.props.html;
		}
	},

	emitChange: function( e ) {

		var html = this.dom.value;
		if ( this.props.onChange && html !== this.lastHtml ) {
			e.target = {
				value: html
			};
			this.props.onChange( e );
		}
		this.lastHtml = html;
	},

	highlight: function() {

		this.dom.focus();
		Utils.selectElementContents( this.dom );
	},

	unhighlight: function() {

		this.dom.blur();
		Utils.deselectElementContents( this.dom );
	},

	handleInput: function( e ) {

		this.emitChange( e );
	},

	handleFocus: function(e) {

		if ( this.props.onFocus ) {
			this.props.onFocus( e );
		}
	},

	handleBlur: function( e ) {

		this.emitChange( e );
		this.lastHtml = undefined;

		if ( this.props.onBlur ) {
			this.props.onBlur( e );
		}
	},

	render: function() {
		
		return (
			React.createElement("input", {className: "input", readOnly: !this.props.editable, spellCheck: false, 
				placeholder: this.props.placeholder, 
				onInput: this.handleInput, onFocus: this.handleFocus, onBlur: this.handleBlur, 
				defaultValue: this.props.html})
		);
	}
} );


module.exports = Input;