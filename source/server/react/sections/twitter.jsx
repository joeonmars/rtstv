var React = require( 'react' );
var BaseSection = require('./base');
var _ = require('underscore');
var classnames = require('classnames');
var TweetEmbed = require('../tweetembed');


var Twitter = React.createClass( {

	getDefaultProps: function() {

	    return {
	    	totalPages: 3
	    };
	},

	getInitialState: function() {

	    return {
	    	page: 0      
	    };
	},

	componentWillUpdate: function(nextProps, nextState) {

		if(nextState.page !== this.state.page) {

			var pagePerc = 100 / this.props.totalPages;

			TweenMax.to(this.refs.tweets, .65, {
				x: pagePerc * -nextState.page + '%',
				ease: Expo.easeOut
			});
		}
	},

	toPage: function( page ) {

		this.setState({
			page: page
		});
	},

	nextPage: function() {

		this.toPage( Math.min(this.state.page + 1, this.props.totalPages - 1) );
	},

	prevPage: function() {

		this.toPage( Math.max(this.state.page - 1, 0) );
	},

	renderTweet: function( tweet, index ) {

		return(
			<li key={index}>
				<TweetEmbed id={tweet} />
			</li>
		);
	},

	renderThumb: function(index) {

		var disabled = (index === this.state.page);

		return (
			<li key={index}>
				<button disabled={disabled} onClick={this.toPage.bind(this, index)}></button>
			</li>
		);
	},

	render: function() {

		var data = this.props.data;

		var prevDisabled = (this.state.page === 0);
		var nextDisabled = (this.state.page === this.props.totalPages - 1);

		return (
			<BaseSection id='twitter'>
				<article>
					<h1 className='heading' dangerouslySetInnerHTML={{__html: data.heading}}></h1>
					<h2 className='subheading' dangerouslySetInnerHTML={{__html: data.subheading}}></h2>
				</article>

				<div className='tweet-container'>
					<div className='tweet-scroller'>
						<ul className='tweets' ref='tweets'>
							{data.tweets.map(this.renderTweet)}
						</ul>
					</div>
					<div className='gradient left'></div>
					<div className='gradient right'></div>
					<div className='prev' onClick={this.prevPage}>
						<button disabled={prevDisabled}>
							<span className='icon icon-arrow-prev'></span>
						</button>
					</div>
					<div className='next'>
						<button disabled={nextDisabled} onClick={this.nextPage}>
							<span className='icon icon-arrow-next'></span>
						</button>
					</div>
					<ul className='thumbs'>
						{_.times(this.props.totalPages, this.renderThumb)}
					</ul>
				</div>
			</BaseSection>
		);
	}
});


module.exports = Twitter;