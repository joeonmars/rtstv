var _ = require('underscore');
var React = require( 'react' );
var PromoSection = require('./sections/promo');
var NewsSection = require('./sections/news');
var RealistsSection = require('./sections/realists');
var TwitterSection = require('./sections/twitter');
var AppStoreSection = require('./sections/appstore');


var MainContent = React.createClass( {displayName: "MainContent",

	getSectionComponent: function(section) {
		
		switch(section.id) {
			case 'promo':
				return React.createElement(PromoSection, {key: section.id, data: section});

			case 'news':
				return React.createElement(NewsSection, {key: section.id, data: section});

			case 'realists':
				return React.createElement(RealistsSection, {key: section.id, data: section});

			case 'twitter':
				return React.createElement(TwitterSection, {key: section.id, data: section});

			case 'appstore':
				return React.createElement(AppStoreSection, {key: section.id, data: section});
		}
	},

	renderSections: function() {

		return _.map(this.props.sections, this.getSectionComponent);
	},

	render: function() {

		return (
			React.createElement("div", {id: "main"}, 
				this.renderSections()
			)
		);
	}

} );

module.exports = MainContent;