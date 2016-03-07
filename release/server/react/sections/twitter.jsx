var React = require( 'react' );
var BaseSection = require('./base');
var _ = require('underscore');
var classnames = require('classnames');
var TweetEmbed = require('../tweetembed');


var Twitter = React.createClass( {

	getInitialState: function() {

	    return {
	    	page: 0,
	    	totalPages: 0
	    };
	},

	componentWillUpdate: function(nextProps, nextState) {

		if(nextState.page !== this.state.page ||
			nextState.totalPages !== this.state.totalPages) {

			var pagePerc = 100 / this.state.totalPages;

			TweenMax.to(this.refs.tweets, .65, {
				x: pagePerc * -nextState.page + '%',
				ease: Expo.easeOut
			});
		}
	},

	resize: function() {

		var singlePageWidth = $(this.refs.tweetScroller).outerWidth();
		var totalPageWidth = $(this.refs.tweets).outerWidth();
		var totalPages = Math.round(totalPageWidth / singlePageWidth);

		this.setState({
			page: 0,
			totalPages: totalPages
		});
	},

	toPage: function( page ) {

		this.setState({
			page: page
		});
	},

	nextPage: function() {

		this.toPage( Math.min(this.state.page + 1, this.state.totalPages - 1) );
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
		var nextDisabled = (this.state.page === this.state.totalPages - 1);

		return (
			<BaseSection id='twitter'
				handleResize={this.resize}>

				<article>
					<h1 className='heading' dangerouslySetInnerHTML={{__html: data.heading}}></h1>
					<h2 className='subheading' dangerouslySetInnerHTML={{__html: data.subheading}}></h2>
				</article>

				<div className='tweet-container'>
					<div className='tweet-scroller' ref='tweetScroller'>
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
						{_.times(this.state.totalPages, this.renderThumb)}
					</ul>
				</div>
				
			</BaseSection>
		);
	}
});


module.exports = Twitter;