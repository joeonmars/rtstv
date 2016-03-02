var React = require( 'react' );
var ReactDOM = require( 'react-dom' );
var classnames = require( 'classnames' );
var BaseBlock = require( './baseblock' );
var ShineCanvas = require( './fx/shinecanvas' );
var Input = require( './input' );
var PrimaryButton = require( './primarybutton' );
var Utils = require( '../helpers/utils' );


var TextBlock = React.createClass( {displayName: "TextBlock",

	mixins: [ BaseBlock.getMixins() ],

	getDefaultProps: function() {

		return {
			type: 'text',
			useCanvas: ShineCanvas.shouldUseGL()
		};
	},

	componentDidMount: function() {

		this.setState({
			loaded: true
		});
	},

	componentDidUpdate: function( prevProps, prevState ) {

		if ( prevState.inEdit !== this.state.inEdit ) {

			if ( this.state.inEdit ) {

				this.refs.input.highlight();

			} else {

				this.refs.input.unhighlight();
			}
		}

		if ( prevState.content !== this.state.content ) {
			this.trackEdit();
		}
	},

	render: function() {

		var background = this.props.useCanvas ? (
			React.createElement(ShineCanvas, {color: "silver"})
		) : null;

		var contentClassname = classnames('content', {
			'use-canvas': this.props.useCanvas
		});

		return (
			React.createElement(BaseBlock, {
				type: this.props.type, 
				inEdit: this.state.inEdit, loaded: this.state.loaded, liked: this.state.liked, 
				showEditOverlay: false, 
				toggleEdit: this.toggleEdit, confirmEdit: this.confirmEdit, cancelEdit: this.cancelEdit, 
				onClickShare: this.onClickShare, onLiked: this.onLiked}, 

				React.createElement("div", {className: contentClassname}, 
					background, 
					React.createElement("div", {className: "curtain"}), 
					React.createElement("form", {onSubmit: this.confirmEdit}, 
						React.createElement(Input, {ref: "input", placeholder: "LEAVE YOUR MESSAGE", 
							editable: this.state.inEdit, html: this.getCurrentContent(), onChange: this.setTempContent})
					), 
					React.createElement("div", {className: "display-content"}, this.state.content), 
					React.createElement(PrimaryButton, {text: "Post", size: "sm", disabled: this.state.contentEmptied, onClick: this.confirmEdit}), 
					React.createElement("button", {className: "icon icon-no close-button", onClick: this.cancelEdit})
				)
				
			)
		);
	}
} );

module.exports = TextBlock;