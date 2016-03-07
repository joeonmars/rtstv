var Utils = require( './utils' );
var moment = require( 'moment' );

var getRandomTimeBeforeYesterday = function( opt_ms_range ) {

	var msRange = opt_ms_range || ( 1000 * 60 * 60 * 24 * 7 );
	msRange = Math.round( Math.random() * msRange );

	var time = moment().subtract( 1, 'day' ).subtract( msRange, 'ms' );
	return time.toDate().getTime();
};

var defaultData = {
	submissions: [ {
		type: 'text',
		content: 'We need to stop interrupting what people are interested in & be what people are interested in.',
		scores: 1,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'text',
		content: 'Nobody counts the number of ads you run; they just remember the impression you make.',
		scores: 3,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'text',
		content: 'Nobody reads ads. People read what interests them, and sometimes it’s an ad.',
		scores: 0,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'text',
		content: 'The only people who care about advertising are the people who work in advertising.',
		scores: 0,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'text',
		content: 'By definition, remarkable things get remarked upon.',
		scores: 0,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'text',
		content: 'Rules are what the artist breaks; the memorable never emerged from a formula.',
		scores: 0,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'text',
		content: 'In advertising, not to be different is virtually suicidal.',
		scores: 2,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'text',
		content: 'Advertising is only evil when it advertises evil things.',
		scores: 1,
		appearances: 4,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'text',
		content: 'If dogs don’t like your dog food, the packaging doesn’t matter.',
		scores: 0,
		appearances: 1,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'text',
		content: 'Simplicity is the ultimate sophistication.',
		scores: 0,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'text',
		content: 'Make it simple. Make it memorable. Make it inviting to look at.',
		scores: 1,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'text',
		content: 'The aim of marketing is to know and understand the customer so well the product or service fits him and sells itself.',
		scores: 3,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'text',
		content: 'Creativity without strategy is called art, creative with strategy is called advertising.',
		scores: 0,
		appearances: 4,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'text',
		content: 'An idea can turn to magic or dust, depending on the talent that rubs against it.',
		scores: 4,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'text',
		content: 'Think like a wise man but communicate in the language of the people.',
		scores: 0,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'video',
		content: 'https://www.youtube.com/watch?v=XjJQBjWYDTs',
		scores: 0,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'video',
		content: 'https://www.youtube.com/watch?v=xKVS_81Op5A',
		scores: 0,
		appearances: 1,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'video',
		content: 'https://www.youtube.com/watch?v=em9QA5NI04I',
		scores: 1,
		appearances: 3,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'video',
		content: 'https://www.youtube.com/watch?v=UpMLVDma-4Q',
		scores: 1,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'video',
		content: 'https://www.youtube.com/watch?v=rPrWtz249uU',
		scores: 0,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'video',
		content: 'https://www.youtube.com/watch?v=Iy1rumvo9xc',
		scores: 0,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'video',
		content: 'https://www.youtube.com/watch?v=K9vFWA1rnWc',
		scores: 0,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'video',
		content: 'https://www.youtube.com/watch?v=2eqqcVFRMPg',
		scores: 3,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'video',
		content: 'https://www.youtube.com/watch?v=VVKdqf2Oe9k',
		scores: 2,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'video',
		content: 'https://www.youtube.com/watch?v=GCL4VrSItb4',
		scores: 0,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'video',
		content: 'https://www.youtube.com/watch?v=Go9rf9GmYpM',
		scores: 0,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'video',
		content: 'https://www.youtube.com/watch?v=n6S1JoCSVNU',
		scores: 3,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'video',
		content: 'https://www.youtube.com/watch?v=qPpgjJ8oxj8',
		scores: 2,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'video',
		content: 'https://www.youtube.com/watch?v=o2P5E7cFt9s',
		scores: 1,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'video',
		content: 'https://www.youtube.com/watch?v=Vttuonfu2BM',
		scores: 0,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'tweet',
		content: 'https://twitter.com/wknyc/status/667095527994052608',
		scores: 0,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'tweet',
		content: 'https://twitter.com/WiedenKennedy/status/666308998908346368',
		scores: 0,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'tweet',
		content: 'https://twitter.com/kfc/status/658740334332002304',
		scores: 0,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'tweet',
		content: 'https://twitter.com/BBCWorld/status/663801081823166464',
		scores: 1,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'tweet',
		content: 'https://twitter.com/ufc/status/663515601273405440',
		scores: 0,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'tweet',
		content: 'https://twitter.com/NASCAR/status/663495136702279680',
		scores: 5,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'tweet',
		content: 'https://twitter.com/WarnerBrosEnt/status/662450620671131654',
		scores: 0,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'tweet',
		content: 'https://twitter.com/WarnerBrosEnt/status/662813000303276035',
		scores: 4,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'tweet',
		content: 'https://twitter.com/Wario64/status/663909204785172480',
		scores: 2,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'tweet',
		content: 'https://twitter.com/Coestar/status/664036996445134848',
		scores: 3,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'tweet',
		content: 'https://twitter.com/CouRageJD/status/661655336823189504',
		scores: 0,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'tweet',
		content: 'https://twitter.com/Nore_MC/status/662630461575929856',
		scores: 2,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'tweet',
		content: 'https://twitter.com/rksadhi/status/662915215407775744',
		scores: 0,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'tweet',
		content: 'https://twitter.com/thehill/status/664137199462580225',
		scores: 0,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'tweet',
		content: 'https://twitter.com/BarackObama/status/663840377154215936',
		scores: 0,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'image',
		content: 'https://www.instagram.com/p/vCd6uzQn9c/',
		scores: 0,
		appearances: 3,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'image',
		content: 'https://www.instagram.com/p/Z6ZmYewnzz/',
		scores: 0,
		appearances: 3,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'image',
		content: 'https://www.instagram.com/p/zbSHkTwnym/',
		scores: 1,
		appearances: 4,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'image',
		content: 'https://www.instagram.com/p/VaD7eQQn93/',
		scores: 0,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'image',
		content: 'https://www.instagram.com/p/X52_v8wnyj/',
		scores: 1,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'image',
		content: 'https://www.instagram.com/p/JfzZ-BQnyv/',
		scores: 2,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'image',
		content: 'https://www.instagram.com/p/-blRJDiAPV/',
		scores: 0,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'image',
		content: 'https://www.instagram.com/p/-bgSHSgfep/',
		scores: 3,
		appearances: 4,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'image',
		content: 'https://www.instagram.com/p/I9sz3DQn6A/',
		scores: 4,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'image',
		content: 'https://www.instagram.com/p/8_Zflkj_qD/',
		scores: 0,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'image',
		content: 'https://www.instagram.com/p/6re5nQy13n/',
		scores: 1,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'image',
		content: 'https://www.instagram.com/p/-bv8K5TApL/',
		scores: 0,
		appearances: 5,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'image',
		content: 'https://www.instagram.com/p/rGNF6ILz2k/',
		scores: 0,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'image',
		content: 'https://www.instagram.com/p/-btWNwI3Sp/',
		scores: 0,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'image',
		content: 'https://www.instagram.com/p/-bgOqspJVZ/',
		scores: 6,
		appearances: 1,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'giphy',
		content: 'http://media1.giphy.com/media/Gzus0eadeEFIQ/giphy.gif',
		scores: 5,
		appearances: 0,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'giphy',
		content: 'http://media2.giphy.com/media/5xtDarH5225prbkGJ20/giphy.gif',
		scores: 0,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'giphy',
		content: 'http://media1.giphy.com/media/26BkNBw77lmYxbaaQ/giphy.gif',
		scores: 0,
		appearances: 1,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'giphy',
		content: 'http://media1.giphy.com/media/XOQ3s1YbI6eFG/giphy.gif',
		scores: 2,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'giphy',
		content: 'http://media0.giphy.com/media/xTiTnI8D1aV3vfozVm/giphy.gif',
		scores: 0,
		appearances: 3,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'giphy',
		content: 'http://media4.giphy.com/media/OjzZJlBfmdpjG/giphy.gif',
		scores: 0,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'giphy',
		content: 'http://media0.giphy.com/media/BOG99s4vUJnLa/giphy.gif',
		scores: 0,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'giphy',
		content: 'https://media4.giphy.com/media/qoJ9sZu2Xui9a/giphy.gif',
		scores: 0,
		appearances: 4,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'giphy',
		content: 'https://media4.giphy.com/media/QHHQ78HunEb2E/giphy.gif',
		scores: 0,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'giphy',
		content: 'https://media0.giphy.com/media/ZewRjKMKxw1vG/giphy.gif',
		scores: 3,
		appearances: 5,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'giphy',
		content: 'https://media0.giphy.com/media/VkA7jJ0RqfkDS/giphy.gif',
		scores: 0,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'giphy',
		content: 'https://media4.giphy.com/media/WIvwbfRqr4veg/giphy.gif',
		scores: 1,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'giphy',
		content: 'https://media2.giphy.com/media/l41lFj8afmWIo3yW4/giphy.gif',
		scores: 0,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'giphy',
		content: 'http://media2.giphy.com/media/xTk9ZTRVpa28pLjYVa/giphy.gif',
		scores: 2,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'giphy',
		content: 'https://media4.giphy.com/media/jWsQNUItU01l6/giphy.gif',
		scores: 2,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'giphy',
		content: 'https://media4.giphy.com/media/qoJ9sZu2Xui9a/giphy.gif',
		scores: 0,
		appearances: 3,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'sound',
		content: 'https://soundcloud.com/doblemusicproductions/leo-vince-cosmos',
		scores: 0,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'sound',
		content: 'https://soundcloud.com/zemaria/past-2-digikid84-remix',
		scores: 5,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'sound',
		content: 'https://soundcloud.com/madeon/madeon-finale',
		scores: 0,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'sound',
		content: 'https://soundcloud.com/garritan/gcpo-bach-tocatta-and-fugue-v2',
		scores: 2,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'sound',
		content: 'https://soundcloud.com/majidjordan/mylove',
		scores: 3,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'sound',
		content: 'https://soundcloud.com/iulianmaftei/yunus-guvenen-indigo',
		scores: 0,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'sound',
		content: 'https://soundcloud.com/volodymyr-shyshla/jain-rock',
		scores: 0,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'sound',
		content: 'https://soundcloud.com/alexandrums/mozart-requiem-in-d-minor-k-626-iii-sequenz-dies-irae',
		scores: 0,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'sound',
		content: 'https://soundcloud.com/bonobo/heaven-for-the-sinner',
		scores: 0,
		appearances: 4,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'sound',
		content: 'https://soundcloud.com/chris-oni-thompon-2/bonobo-nightlite-instrumental',
		scores: 0,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'sound',
		content: 'https://soundcloud.com/warp-records/aphex-twin-minipops-67-1202source-field-mix',
		scores: 0,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'sound',
		content: 'https://soundcloud.com/thefaxmachine/bonobo-pick-up',
		scores: 0,
		appearances: 2,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'sound',
		content: 'https://soundcloud.com/latenighttales/fila-brazillia-nature-boy-free-download',
		scores: 2,
		appearances: 1,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'sound',
		content: 'https://soundcloud.com/highcontrast/california-love-high-contrast-remix',
		scores: 3,
		appearances: 3,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'sound',
		content: 'https://soundcloud.com/ambienteer/ambienteer-it-has-its-function-03-ennio',
		scores: 0,
		appearances: 4,
		timeCreated: getRandomTimeBeforeYesterday()
	}, {
		type: 'sound',
		content: 'https://soundcloud.com/can-u-feel-it-in-the-air/thievery-corporation-saudade',
		scores: 0,
		appearances: 1,
		timeCreated: getRandomTimeBeforeYesterday()
	} ],
	chathistory: [ {
		username: 'user 1',
		message: 'This is a message from user 1.'
	}, {
		username: 'user 2',
		message: 'This is a message from user 2.'
	}, {
		username: 'dave droga',
		message: 'I will win 5 Andys this year.'
	}, {
		username: 'SIR_SORRELL',
		message: 'You are young and naive.'
	}, {
		username: 'Dan',
		message: 'Just do it.'
	} ]
};


var _instance;


function Seed() {};


Seed.prototype.createSubmissionEntry = function( type, content ) {

	return {
		type: type,
		content: content,
		scores: 0,
		appearances: 0,
		timeCreated: getRandomTimeBeforeYesterday()
	};
};


Seed.prototype.createChatEntry = function( username, message ) {

	return {
		username: username,
		message: message
	};
};


Seed.prototype.getDefaultData = function() {

	return defaultData;
};


module.exports = Utils.createSingletonNow( _instance, Seed );