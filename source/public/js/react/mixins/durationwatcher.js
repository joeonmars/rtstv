var React = require( 'react' );
var ReactDOM = require( 'react-dom' );


var socket;


var mixins = {

	componentDidMount: function() {

		var socketController = require('controllers/socketcontroller')();
		socket = socketController.getSocketByNamespace( 'submission' );

		this.trackStarted = false;
		this.trackedId = null;
		this.trackedType = null;
	},

	startTrackingDuration: function( id, type ) {

		if(this.trackStarted) {
			return;
		}else {
			this.trackStarted = true;
			this.trackedId = id;
			this.trackedType = type;
		}

		this.durationTrackStart = Date.now();
	},

	stopTrackingDuration: function() {

		if(!this.trackStarted) {
			return;
		}else {
			this.trackStarted = false;
		}

		var durationTracked = (Date.now() - this.durationTrackStart) / 1000;

		var threshold = 5;

		if(durationTracked > threshold) {

			var payload = {
				submissionId: this.trackedId,
				type: this.trackedType,
				duration: durationTracked
			};

			console.log(payload);

			socket.emit( global.config.EVENTS.SUBMISSION_DURATION_SENT_FROM_CLIENT, payload );
		}
	}
};


module.exports = mixins;