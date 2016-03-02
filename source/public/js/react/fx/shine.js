var _ = require( 'underscore' );
var React = require( 'react' );
var ReactDOM = require( 'react-dom' );
var GL = require( 'gl-react-joeonmars-fork' );

var _instance;
var container;
var startTime;
var width = 1024;
var height = 2048;

var shaders = GL.Shaders.create({
  simplexNoise: {
    frag:
    ("\n\t\tprecision highp float;\n\t\tvarying vec2 uv;\n\t\tuniform float time;\n\t\tuniform sampler2D tile;\n\n\t\tvec3 random3(vec3 c) {\n\t\t\tfloat j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));\n\t\t\tvec3 r;\n\t\t\tr.z = fract(512.0*j);\n\t\t\tj *= .125;\n\t\t\tr.x = fract(512.0*j);\n\t\t\tj *= .125;\n\t\t\tr.y = fract(512.0*j);\n\t\t\treturn r-0.5;\n\t\t}\n\n\t\tconst float F3 =  0.3333333;\n\t\tconst float G3 =  0.1666667;\n\n\t\tfloat simplex3d(vec3 p) {\n\n\t\t\tvec3 s = floor(p + dot(p, vec3(F3)));\n\t\t\tvec3 x = p - s + dot(s, vec3(G3));\n\n\t\t\tvec3 e = step(vec3(0.0), x - x.yzx);\n\t\t\tvec3 i1 = e*(1.0 - e.zxy);\n\t\t\tvec3 i2 = 1.0 - e.zxy*(1.0 - e);\n\t\t\t\t\n\t\t\tvec3 x1 = x - i1 + G3;\n\t\t\tvec3 x2 = x - i2 + 2.0*G3;\n\t\t\tvec3 x3 = x - 1.0 + 3.0*G3;\n\n\t\t\tvec4 w, d;\n\n\t\t\tw.x = dot(x, x);\n\t\t\tw.y = dot(x1, x1);\n\t\t\tw.z = dot(x2, x2);\n\t\t\tw.w = dot(x3, x3);\n\n\t\t\tw = max(0.6 - w, 0.0);\n\n\t\t\td.x = dot(random3(s), x);\n\t\t\td.y = dot(random3(s + i1), x1);\n\t\t\td.z = dot(random3(s + i2), x2);\n\t\t\td.w = dot(random3(s + 1.0), x3);\n\n\t\t\tw *= w;\n\t\t\tw *= w;\n\t\t\td *= w;\n\n\t\t\treturn dot(d, vec4(52.0));\n\t\t}\n\n\t\tfloat simplex3d_fractal(vec3 m) {\n\t\t    return 0.5333333*simplex3d(m)\n\t\t    \t+0.2666667*simplex3d(2.0*m)\n\t\t    \t+0.1333333*simplex3d(4.0*m)\n\t\t    \t+0.0666667*simplex3d(8.0*m);\n\t\t}\n\n\t\tvec3 linearDodge( vec3 s, vec3 d ) {\n\t\t\treturn s + d;\n\t\t}\n\n\t\tvoid main () {\n\n\t\t  \tvec2 p = vec2(uv.x, uv.y * 0.4);\n\t\t\tvec3 p3 = vec3(p, time*0.1);\n\t\t\t\n\t\t\tfloat value = simplex3d_fractal( p3 * 0.65 );\n\t\t\t\n\t\t\tvalue = 0.15 + 0.85*value;\n\t\t\t\n\t\t\t// ref: https://www.shadertoy.com/view/XdS3RW\n\t\t\t// noise texture (upper)\n\t\t\tvec3 noise = vec3(value);\n\n\t\t\t// tile texture (lower)\n\t\t\tvec3 tileTexture = texture2D(tile, uv).xyz;\n\t\t\tvec3 blended = linearDodge(noise, tileTexture);\n\n\t\t\tgl_FragColor = vec4(blended, 1.0);\n\n\t\t\treturn;\n\t\t}\n\t"





















































































)
  }
});


var Shine = React.createClass( {displayName: "Shine",

	statics: {

		getContainer: function() {
			container = container || $('<div>').css( {
				'position': 'fixed',
				'z-index': 1000,
				'top': 0,
				'left': 0
			} ).get(0);

			return container;
		}
	},

	getInitialState: function() {

		return {
			time: 0,
			tile: ''
		};
	},

	componentDidMount: function() {

		// create tile texture
		var $goldTileImg = $('<img>').attr('src', '/images/gold-tile.png');

		var $silverTileImg = $('<img>').attr('src', '/images/silver-tile.png');

		var promises = _.map( [$goldTileImg, $silverTileImg], function($img) {

			var $deferred = $.Deferred();

			$img.one('load', function() {
			    $deferred.resolve();
			});

			return $deferred.promise();
		} );

		$.when.apply(null, promises).done(function() {

			var canvas = $('<canvas>').get(0);
			canvas.width = width;
			canvas.height = height;

			var ctx = canvas.getContext('2d');

			var goldPattern = ctx.createPattern( $goldTileImg.get(0), 'repeat' );
			var silverPattern = ctx.createPattern( $silverTileImg.get(0), 'repeat' );

			ctx.fillStyle = goldPattern;
			ctx.fillRect(0, 0, width, height/2);

			ctx.fillStyle = silverPattern;
			ctx.fillRect(0, height/2, width, height/2);

			this.setState({
			
				tile: canvas.toDataURL()
			
			}, function() {
				
				TweenMax.ticker.addEventListener('tick', this.onFrameUpdate, this);

			}.bind(this));

		}.bind(this));

		// Only for test
		window.showNoise = function() {
			window.noiseCanvas = $(container).find('canvas').get(0);
			document.body.appendChild( container );
		}
	},

	getCanvas: function() {

		return this.refs.gl.getGLCanvas().canvas;
	},

	onFrameUpdate: function() {

 		var now = Date.now();
 		startTime = startTime || now;
      	var time = (now - startTime) / 1000;

      	this.setState({
			time: time
		});
	},

	render: function() {

		return (
			React.createElement(GL.View, {ref: "gl", shader: shaders.simplexNoise, width: width, height: height, uniforms: this.state})
		);
	}
});


module.exports = function() {

	if(!_instance) {
		var shine = React.createElement( Shine );
		_instance = ReactDOM.render( shine, Shine.getContainer() );
	}

	return _instance;
};