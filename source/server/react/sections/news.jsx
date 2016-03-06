var React = require( 'react' );
var BaseSection = require('./base');
var classnames = require('classnames');


var News = React.createClass( {

	renderTestimonials: function() {

		var testimonials = this.props.data.testimonials;		

		return testimonials.map( function(testimonial, index) {

			var logoClassName = classnames('logo', testimonial.id);

			return(
				<li key={index}>
					<div className={logoClassName}></div>
					<p>{'"' + testimonial.text + '"'}</p>
				</li>
			);
		});
	},

	render: function() {

		var data = this.props.data;

		return (
			<BaseSection id='news'>
				<article>
					<h1 className='heading' dangerouslySetInnerHTML={{__html: data.heading}}></h1>
					<div className='body small' dangerouslySetInnerHTML={{__html: data.body}}></div>
				</article>
				<ul className='testimonials'>
					{this.renderTestimonials()}
				</ul>
			</BaseSection>
		);
	}
});


module.exports = News;