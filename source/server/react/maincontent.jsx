var _ = require('underscore');
var React = require( 'react' );
var CollageSection = require( './collagesection' );
var SoundSection = require( './soundsection' );
var FallbackSoundSection = require( './fallbacksoundsection' );
var ChatSection = require( './chatsection' );
var IntroSection = require( './introsection' );
var PromoSection = require( './promosection' );
var ShareSection = require( './sharesection' );
var ExtendedSection = require( './extendedsection' );
var ConsentOverlay = require( './consentoverlay' );
var StickySoundPlayer = require( './stickysoundplayer' );


var MainContent = React.createClass( {

	render: function() {

		// Typed submissions sorted by DB
		var typedSubmissions = {
			'image': this.props.imageSubmissions.concat(),
			'video': this.props.videoSubmissions.concat(),
			'giphy': this.props.giphySubmissions.concat(),
			'tweet': this.props.tweetSubmissions.concat(),
			'text': this.props.textSubmissions.concat()
		};

		// Extract submissions for use by the first three sections
		var introCombination = IntroSection.getRandomCombination();
		var introSubmissions = _.map(introCombination.combination, function(type) {
			return typedSubmissions[type].shift();
		});

		var firstCollageCombination = CollageSection.getCombinationAt(0);
		var firstCollageSubmissions = _.map(firstCollageCombination, function(type) {
			return typedSubmissions[type].shift();
		});

		var secondCollageCombination = CollageSection.getCombinationAt(1);
		var secondCollageSubmissions = _.map(secondCollageCombination, function(type) {
			return typedSubmissions[type].shift();
		});

		var extendedSubmissions = typedSubmissions;

		// Selectively render sound section
		var soundSection = (!this.props.ie && (!this.props.mobile || this.props.tablet === 'iPad') ) ?
			( <SoundSection submissions={this.props.soundSubmissions} /> ) :
			( <FallbackSoundSection submissions={this.props.soundSubmissions} phone={this.props.phone} /> );

		// Selectively render sticky sound player
		var stickySoundPlayer = (!this.props.phone) ? 
			( <StickySoundPlayer /> ) : null;

		//
		return (
			<div id='main'>

				<IntroSection submissions={introSubmissions} layoutId={introCombination.layoutId} mobile={this.props.mobile} />

				<PromoSection
					title='THIS SITE IS A PURE INTERACTION.<br/> IT IS AN AMORPHOUS,<br/> INTELLIGENT BEING.'
					paragraph='You control what everyone who visits this site after you sees.<br/> Post any tweet, YouTube, Instagram, GIF or copy. Want to make this entire page an ode to Ancient Egyptian Pottery? Knock yourself out.<br/><br/> This site is the best. If yours is better, it deserves an ANDY.'
					shape='triangle'
					classNames='promo about'
					showScrollButton={true} />

				<CollageSection submissions={firstCollageSubmissions} layoutId={0} />

				<PromoSection
					title='AMAZON MEDIA GROUP<br/> AND THE ANDYs.'
					paragraph='If your campaign beat the best, it must have had a lot of people working on it. Now you can give everyone a statue. Order 3D-printed ANDY Awards, with Amazon.com.'
					ctaText='Buy your trophy now'
					ctaUrl='http://www.amazon.com/The-International-ANDY-Awards-Custom/dp/B018Y6EC00/ref=sr_1_1?m=A29CJH5HJYDA6I&s=merchant-items&ie=UTF8&qid=1449626798&sr=1-1&refinements=p_4%3AThe+International+ANDY+Awards'
					trackingCategory='amazon'
					trackingAction='buy'
					shape='circle'
					classNames='promo amazon' />

				<ChatSection chatHistory={this.props.chatHistory} />

				<CollageSection submissions={secondCollageSubmissions} layoutId={1} />

				{soundSection}

				<ExtendedSection submissions={extendedSubmissions} />
				
				<ShareSection />

				<footer>
					<div>
						<a className='text-link' href='https://www.andyawards.com/privacy/' target='_blank'>Privacy</a>
						<a className='text-link' href='https://www.andyawards.com/terms-conditions/' target='_blank'>Terms & Conditions</a>
					</div>
				</footer>

				{stickySoundPlayer}

				<ConsentOverlay />

			</div>
		);
	}

} );

module.exports = MainContent;