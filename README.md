#Reuters TV Reception
A try on the Reuters TV webpage, to demonstrate my coding skills and workflow for HTML/CSS/JS based development. 

![Home Page](https://s3.amazonaws.com/f.cl.ly/items/250x1I3k3A2v3O1g103a/rtstv.jpg?v=663d3b7c)

**Preview version**

<https://rtstv.herokuapp.com/>

**Uncomplied JS with Susy grid overlay**

<https://rtstv.herokuapp.com/?debug=true>

&nbsp;

## Concerns
* **Server-side rendering** Maximum compatibility with Search Engines, and fast JavaScript execution on the client.
* **Consolidated JS/CSS tags** Use as less script and style tags as possible to boost the page load performance.
* **CMS data integration** Just as a proof of concept, the server currently holds the "CMS data" and inject them into the template.
* **Animation performance** Most animations are made with CSS, reducing JavaScript workload on the client.
* **Responsive Layout** The page can display on desktop, laptops, tablets and smartphones.

&nbsp;

## Design changes
* Moderately tweaked the overall typography.
* Added application download CTA buttons (based on Apple and Google Style Guide) to the promo section.
* Replaced the "Realists" section background from the PSD. Know that was a marketing piece, I want the background to look significantly darker. That is to make sure users can read text that is presented over the image.
* The Tweet embeds look different from the PSD. Because I didn't want to mess up with hacking the iframe styles.
* Animations in various places, as you would easily notice.

&nbsp;

## Non-exhaustive todos:
* Retina image support
* Tweet carousel needs a mobile-friendly UI. The thumbnail dots are difficult for fat fingers.
* Browser tests: Due to time, the page has only been tested on Safari 9, Mobile Safari, Chrome 48 and Firefox 42.

&nbsp;

## Technology
### Front-End
* React
* jQuery
* GSAP
* Compass
* Susy
* ScrollMonitor
* CSS-to-Matrix
* FastClick

### Back-End
* Node.js
* Express
* React

### Utilities
* Grunt
* Browserify

&nbsp;

## How to
### 1. Install node packages

```cd``` to source

```npm install```

### 2. Install Ruby dependencies via Bundler

```cd``` to source

```bundle install```

### 2. Start developing using Grunt

```cd``` to source

```grunt development```

### 3. Build production bundle, using Grunt

```cd``` to source

```grunt release```

### 4. Deploy to Heroku

```cd``` to root

```git subtree push --prefix release heroku master```

&nbsp;