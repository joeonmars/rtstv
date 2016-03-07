var _ = require('underscore');
var React = require( 'react' );
var PromoSection = require('./sections/promo');
var NewsSection = require('./sections/news');
var RealistsSection = require('./sections/realists');
var TwitterSection = require('./sections/twitter');
var AppStoreSection = require('./sections/appstore');


var MainContent = React.createClass( {

	getSectionComponent: function(section) {
		
		switch(section.id) {
			case 'promo':
				return <PromoSection key={section.id} data={section} />;

			case 'news':
				return <NewsSection key={section.id} data={section} />;

			case 'realists':
				return <RealistsSection key={section.id} data={section} />;

			case 'twitter':
				return <TwitterSection key={section.id} data={section} />;

			case 'appstore':
				return <AppStoreSection key={section.id} data={section} />;
		}
	},

	renderSections: function() {

		return _.map(this.props.sections, this.getSectionComponent);
	},

	render: function() {

		return (
			<div id='main'>
				{this.renderSections()}
			</div>
		);
	}

} );

module.exports = MainContent;