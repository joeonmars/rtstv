var React = require( 'react' );
var BaseSection = require('./base');
var _ = require('underscore');


var AppStore = React.createClass( {

	renderReviews: function() {

		var reviews = this.props.data.reviews;

		var stars = _.times(5, function(i) {
			return <span key={i} className='icon icon-star'></span>
		});

		return reviews.map( function(review, index) {
			return(
				<li key={index}>
					<h3>{review.title}</h3>

					<div className='stars'>
						{stars}
					</div>

					<p>{'"' + review.body + '"'}</p>
				</li>
			);
		});
	},

	render: function() {

		var data = this.props.data;

		return (
			<BaseSection id='appstore'>
				<article>
					<h1 className='heading' dangerouslySetInnerHTML={{__html: data.heading}}></h1>
					<h2 className='subheading' dangerouslySetInnerHTML={{__html: data.subheading}}></h2>
				</article>

				<ul className='reviews'>
					{this.renderReviews()}
				</ul>
			</BaseSection>
		);
	}
});


module.exports = AppStore;