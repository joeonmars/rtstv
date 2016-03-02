var React = require( 'react' );
var classnames = require( 'classnames' );


var PrimaryButton = React.createClass( {displayName: "PrimaryButton",

	getDefaultProps: function() {

		return {
			text: 'Primary Button',
			size: '',
			classNames: '',
			disabled: false,
			href: null,
			onClick: null
		};
	},

	render: function() {

		var buttonClassName = classnames('primary-button', this.props.size, this.props.classNames);

		var button = this.props.href ? (
			React.createElement("a", {href: this.props.href, target: "_blank", onClick: this.props.onClick}, this.props.text)
		) : (
			React.createElement("button", {disabled: this.props.disabled, onClick: this.props.onClick}, this.props.text)
		);

		return (
			React.createElement("div", {className: buttonClassName}, 
				button
			)
		);
	}
} );


module.exports = PrimaryButton;