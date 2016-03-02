var React = require( 'react' );
var ReactDOM = require( 'react-dom' );
var _ = require( 'underscore' );
var Utils = require( '../helpers/utils' );


var ContentEditable = React.createClass( {displayName: "ContentEditable",

	dom: null,

	componentDidMount: function() {

		this.dom = ReactDOM.findDOMNode(this);
	},

	shouldComponentUpdate: function( nextProps ) {

		return ( nextProps.editable !== this.props.editable );
	},

	componentDidUpdate: function() {

		if ( this.props.html !== this.dom.innerHTML ) {
			this.dom.innerHTML = this.props.html;
		}
	},

	emitChange: function( e ) {

		var html = this.dom.innerHTML;
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

	handleBlur: function( e ) {

		this.emitChange( e );
		this.lastHtml = undefined;

		if ( this.props.onBlur ) {
			this.props.onBlur( e );
		}
	},

	render: function() {
		
		return (
			React.createElement("div", {className: "input", contentEditable: this.props.editable, spellCheck: false, 
				onInput: this.handleInput, onBlur: this.handleBlur, 
				dangerouslySetInnerHTML: {__html: this.props.html}}
			)
		);
	}
} );


module.exports = ContentEditable;