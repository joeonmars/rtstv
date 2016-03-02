var React = require( 'react' );
var ReactDOM = require( 'react-dom' );
var classnames = require( 'classnames' );
var BaseBlock = require( './baseblock' );
var GifItem = require( './gifitem' );
var Scroller = require('./scroller');
var Input = require( './input' );
var Utils = require( '../helpers/utils' );


var GiphyBlock = React.createClass( {displayName: "GiphyBlock",

	mixins: [ BaseBlock.getMixins() ],

	getDefaultProps: function() {

		return {
			type: 'giphy',
			maxAmount: 100,
			increment: 20
		};
	},

	getInitialState: function() {

		return {
			phrase: '',
			tempPhrase: '',
			gifUrls: [],
			currentAmount: this.props.increment,
			requesting: false
		}
	},

	componentDidUpdate: function( prevProps, prevState ) {

		if ( (prevState.phrase !== this.state.phrase) ||
			(!prevState.inEditOnce && this.state.inEditOnce) ) {

			this.updateGifs();
		}

		if( prevState.gifUrls !== this.state.gifUrls ) {

			this.refs.scroller.scrollTo(0);
			this.refs.scroller.resize();
		}

		if ( prevState.currentAmount !== this.state.currentAmount ) {

			this.refs.scroller.resize();
		}

		if ( prevState.content !== this.state.content ) {
			this.trackEdit();
		}
	},

	handleAnimatedIn: function() {

		$('<img>').attr('src', this.state.content).one('load', function() {

			this.setState({
				loaded: true
			});

		}.bind(this));
	},
	
	updateGifs: function() {

		var searchType = this.state.phrase.length ? 'phrase' : 'trending';

		var endpoint = global.config.SERVER_URL + '/giphy/' + searchType;

		if(this.state.phrase) {
			endpoint += '/' + this.state.phrase + '/' + this.props.maxAmount;
		}else {
			endpoint += '/' + this.props.maxAmount;
		}

		this.setState({
			requesting: true
		});

		$.get( endpoint, function(result) {

			if ( _.isArray( result ) ) {

				this.setState( {
					gifUrls: result,
					currentAmount: this.props.increment,
					requesting: false
				} );
			}

		}.bind(this) );
	},

	getCurrentPhrase: function() {

		var currentPhrase = this.state.inEdit ? this.state.tempPhrase : this.state.phrase;
		return currentPhrase;
	},

	phraseIsEmpty: function() {

		return this.getCurrentPhrase().length === 0;
	},

	setTempPhrase: function( e ) {

		this.setState( {
			tempPhrase: e.target.value
		} );
	},

	createSearchResultItem: function( url, index ) {

		var selected = (this.state.content === url);

		return (
			React.createElement(GifItem, {key: url, url: url, selected: selected, onClick: this.onClickSearchResult})
		);
	},

	onClickSearch: function( e ) {

		if(e) {
			e.preventDefault();
		}
		
		this.setState( {
			phrase: this.getCurrentPhrase()
		} );
	},

	onClickSearchResult: function( e ) {

		var url = e.target.getAttribute( 'data-url' );

		this.setState( {

			tempContent: url

		}, this.confirmEdit );
	},

	onScrolledToBottom: function() {

		var nextAmount = Math.min(this.props.maxAmount, this.state.currentAmount + this.props.increment);

		if( nextAmount > this.state.currentAmount ) {

			this.setState({
				currentAmount: nextAmount
			});
		}
	},

	render: function() {

		var heroGifStyle = {
			backgroundImage: 'url(' + this.state.content + ')',
		};

		var viewPageClassName = classnames( 'view-page', {
			'hide': this.state.inEdit
		} );

		var editPageClassName = classnames( 'edit-page', {
			'hide': !this.state.inEdit
		} );

		var currentGifUrls = this.state.gifUrls.slice( 0, this.state.currentAmount );

		var noResults = (!this.state.gifUrls.length && this.state.phrase.length > 0 && !this.state.requesting) ? (
			React.createElement("div", {className: "no-results"}, 
				React.createElement("p", null, 
					"Sorry, no results matching your searched tag ", React.createElement("em", null, "#", this.state.phrase), 
					React.createElement("br", null), 
					"Try a different one?"
				)
			)
		) : null;

		return (
			React.createElement(BaseBlock, {
				type: this.props.type, 
				inEdit: this.state.inEdit, loaded: this.state.loaded, liked: this.state.liked, 
				showEditOverlay: false, 
				handleAnimatedIn: this.handleAnimatedIn, 
				toggleEdit: this.toggleEdit, confirmEdit: this.confirmEdit, cancelEdit: this.cancelEdit, 
				onClickShare: this.onClickShare, onLiked: this.onLiked}, 

				React.createElement("div", {className: "content"}, 
					React.createElement("div", {className: viewPageClassName}, 
						React.createElement("div", {className: "hero-gif", style: heroGifStyle})
					), 

					React.createElement("div", {className: editPageClassName}, 
						React.createElement(Scroller, {className: "search-results-container", ref: "scroller", 
							onScrolledToBottom: this.onScrolledToBottom}, 
							React.createElement("ul", null, 
							currentGifUrls.map(this.createSearchResultItem)
							), 
							noResults
						), 

						React.createElement("div", {className: "search-controls"}, 
							React.createElement("form", {onSubmit: this.onClickSearch}, 
								React.createElement(Input, {ref: "input", placeholder: "ENTER A GIPHY HASHTAG", 
									editable: this.state.inEdit, html: this.getCurrentPhrase(), onChange: this.setTempPhrase}), 
								React.createElement("button", {className: "search icon icon-search", disabled: this.phraseIsEmpty(), onClick: this.onClickSearch}), 
								React.createElement("div", {className: "logo"})
							)
						)
					)
				)
			
			)
		);
	}
} );

module.exports = GiphyBlock;