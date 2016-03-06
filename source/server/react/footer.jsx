var React = require( 'react' );


var Footer = React.createClass( {

	render: function() {

		return (
			<footer>

				<div className='statement'>
					<p>Apple and the Apple logo are trademarks of Apple Inc., registered in the U.S. and other countries.
					App Store is a service mark of Apple Inc.<br/>Google Play store and the Android logo are trademarks of Google Inc.</p>
				</div>

				<div className='copyright'>
					<p>©2016 Thomson Reuters</p>

					<nav>
						<a href='https://www.reuters.tv/advertise'>Advertise</a>
						<a href='https://www.reuters.tv/publishers'>Publishers</a>
						<a href='https://www.reuters.tv/press'>Press</a>
						<a href='https://www.reuters.tv/careers'>Careers</a>
						<a href='https://www.reuters.tv/tos'>Terms of Use</a>
						<a href='https://www.reuters.tv/privacy'>Privacy Policy</a>
						<a href='https://control.kochava.com/v1/cpi/click?campaign_id=koreuters----ios54b805ad417a4384474cbb806b&amp;network_id=2007&amp;device_id=device_id&amp;site_id=1'>iOS App</a>
						<a href='https://control.kochava.com/v1/cpi/click?campaign_id=koreuters-tv56b3c6db8e4eca4d5677918ca0&amp;network_id=2007&amp;device_id=device_id&amp;site_id=1&amp;append_app_conv_trk_params=1'>Android App</a>
					</nav>
				</div>
				
				<div className='social'>
					<h6>Stay connected with @ReutersTV on</h6>

					<ul>
						<li>
							<a className='facebook' href='https://www.facebook.com/ReutersTV/' target='_blank'>
								<div className='icon-container'>
									<span className='icon icon-facebook'></span>
									<span className='icon icon-facebook'></span>
								</div>
								Facebook
							</a>
						</li>
						<li>
							<a className='twitter' href='https://twitter.com/reuterstv' target='_blank'>
								<div className='icon-container'>
									<span className='icon icon-twitter'></span>
									<span className='icon icon-twitter'></span>
								</div>
								Twitter
							</a>
						</li>
						<li>
							<a className='instagram' href='https://instagram.com/reuterstv/' target='_blank'>
								<div className='icon-container'>
									<span className='icon icon-instagram'></span>
									<span className='icon icon-instagram'></span>
								</div>
								Instagram
							</a>
						</li>
						<li>
							<a className='newsletter' href='#newsletter-modal'>
								<div className='icon-container'>
									<span className='icon icon-letter'></span>
									<span className='icon icon-letter'></span>
								</div>
								Newsletter
							</a>
						</li>
					</ul>
				</div>

			</footer>
		);
	}
});


module.exports = Footer;