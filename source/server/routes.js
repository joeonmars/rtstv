var _ = require( 'underscore' );
var url = require( 'url' );

var MobileDetect = require( 'mobile-detect' );
var spiderDetector = require( 'spider-detector' );


function getCMSData() {

	return {
		title: 'Reuters TV - Reception',
		meta: {
			title: 'Reuters TV - Reception',
			site_name: 'Reuters TV',
			description: 'TV news. Reinvented. Your news when you want it, straight from the source and made to fit your day.'
		},
		sections: [ {
			id: 'promo',
			heading: '<span>Users Love</span><span>Reuters TV</span>',
			body: '<p>Reuters TV launched last week to rave reviews and accolades from the media and new users across the web.</p><p>Featured by Apple as a Best New App in the App store as well as in over 30 digital publications, Reuters TV is celebrated as an “absolutely awesome” service that “brings news to the 21st century.”</p>'
		}, {
			id: 'news',
			heading: '<span>In The</span><span>News</span>',
			body: '<p>Featured in: Variety, The Guardian, Engaget, Fast Company, Cult of Mac, Digital Trends, Media Post, The Next Web, Capital New York, and more.</p>',
			testimonials: [ {
				id: 'adweek',
				text: '...it is beautifully designed. It’s sleek and quick and ultra-responsive.'
			}, {
				id: 'cultofmac',
				text: '...Simply put your iPhone into landscape mode for full-screen video, and it’s like having your own little news TV right next to you.'
			}, {
				id: 'fastcompany',
				text: '...a bold attempt to draw the "cord-cutting" audience that is too busy or, perhaps, too young to be watching TV on a regular basis.'
			}, {
				id: 'digitaltrends',
				text: 'Reuters brings TV news into the 21st century with new iPhone app'
			} ]
		}, {
			id: 'realists',
			heading: 'The Realists',
			body: 'Reuters TV is being embraced by enthusiastic Realists—savvy, informed and aspirational individuals who value authentic storytelling and are too busy to watch traditional news.',
			qualities_heading: 'Realists Are:',
			qualities: [
				'Savvy & Informed',
				'Engaged with the world',
				'Discerning in the quality of their news',
				'Affluent and intelligent',
				'Aspirational',
				'Digital natives'
			]
		}, {
			id: 'twitter',
			heading: 'Twitter',
			subheading: 'Tweets from influential Realists including:',
			tweets: [
				'706232804137304064',
				'706474443007270912',
				'706229787665244160',
				'706474443007270912',
				'706232804137304064',
				'706229787665244160',
				'706232804137304064',
				'706474443007270912',
				'706229787665244160',
				'706474443007270912',
				'706232804137304064',
				'706229787665244160',
				'706232804137304064',
				'706474443007270912',
				'706229787665244160',
				'706474443007270912',
				'706232804137304064',
				'706229787665244160'
			]
		}, {
			id: 'appstore',
			heading: 'App Store',
			subheading: 'An average rating of 4.5 stars',
			reviews: [ {
				title: 'Exactly what I didn\'t know I\'ve been needing',
				body: 'Absolutely obsessed already with this app-- what an innovative new way for me to consume my news!'
			}, {
				title: 'Groundbreaking',
				body: 'This app is just awesome. The UI is slick, the curation and update speed of news stories is phenomenal.'
			}, {
				title: 'Great app',
				body: 'This is a great app and I recommend this to anyone who enjoys hearing about world news.'
			}, {
				title: 'Exceptionally well done',
				body: 'I have been waiting for an app like this! Finally, an unbiased world news service with streaming video.'
			}, {
				title: 'Who knew the news could be this fun',
				body: 'I love this app. I’m hooked.'
			}, {
				title: 'FANTASTIC',
				body: 'One of the most detailed, comprehensive and accurate news programs available today.'
			} ]
		} ]
	};
};

// client routes
exports.index = function( req, res ) {

	var props = {
		cmsData: getCMSData()
	};

	var isSpider = spiderDetector.isSpider( req.headers[ 'user-agent' ] );

	if ( !isSpider ) {

		var mobileDetect = new MobileDetect( req.headers[ 'user-agent' ] );
		props.mobile = mobileDetect.mobile();
		props.phone = mobileDetect.phone();
		props.tablet = mobileDetect.tablet();

		var query = url.parse( req.url, true ).query;

		if ( query.debug === 'true' ) {
			props.debug = true;
		}
	}

	res.render( 'index', props );
};