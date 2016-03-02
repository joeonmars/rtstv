var _ = require('underscore');
var React = require( 'react' );
var classnames = require( 'classnames' );
var BaseSection = require( './basesection' );
var BlockCreator = require('./mixins/blockcreator');

var combinations = [
	['video', 'image',
	 'giphy', 'text',
	 'tweet', 'video'],

	['image', 'video',
	 'text', 'giphy',
	 'image', 'tweet', 'image'],

	['image', 'video',
	 'giphy', 'tweet', 'image',
	 'text', 'image']
];


var CollageSection = React.createClass( {displayName: "CollageSection",

	mixins: [ BlockCreator ],

	statics: {
		getLayoutIdByCount: function( count ) {
			return count % combinations.length;
		},

		getCombinationAt: function( count ) {
			return combinations[ count % combinations.length ];
		}
	},

	getDefaultProps: function() {

		return {
			layoutId: 0
		};
	},

	render: function() {

		var sectionClassNames = classnames("collage", "layout-" + this.props.layoutId);

		return (
			React.createElement(BaseSection, {
				classNames: sectionClassNames}, 

				this.props.submissions.map( this.createBlock)

			)
		);
	}
} );

module.exports = CollageSection;