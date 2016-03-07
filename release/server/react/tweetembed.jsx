var React = require( 'react' );
var _ = require('underscore');


var callbacks = [];

function addScript(src, cb) {

	if(callbacks.length === 0) {

		callbacks.push(cb);

		var s = document.createElement('script');
		s.setAttribute('src', src);

		s.onload = function() {
			_.each(callbacks, function(cb) {
				cb();
			});
		}

		document.body.appendChild(s);

	}else {

		callbacks.push(cb);
	}
};


var TweetEmbed = React.createClass( {

	componentDidMount: function() {

	    if (!window.twttr) {

	    	addScript('//platform.twitter.com/widgets.js', this.renderTweet);

	    }else {

	    	this.renderTweet();
	    }
	},

	renderTweet: function() {

		var options = {
			'cards': 'hidden'
		};

		window.twttr.widgets.createTweetEmbed(this.props.id, this.refs.container, options);
	},

	render: function() {

		return (
			<div ref='container' />
		);
	}
});


module.exports = TweetEmbed;