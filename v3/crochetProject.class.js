function CrochetProject( ) { //svgCanvasId ) {
	
	// *********************
	//  PRIVATE PROPERTIES
	// *********************

	// basic
	this._stitches = new Array();
	this._nodes = new Array();
	this._links = new Array();
	this._nodeOnHook = null;
	this._focusedNode = null;
		
	this.registerNode = function( n ) {
		
	}

	this.unRegisterNode = function( n ) {
		
	}

	this.registerLink = function( l ) {
		
	}

	this.unRegisterLink = function( l ) {
		
	}
	
	// overrides the default .toString()
	this.toString = function() {
		return '[object CrochetProject]';
	}
	
/*
	// //FIRST let's set up the drawing surface

	// elementary parameters
	const this._svg_total_w = window.innerWidth - 20;
	const this._svg_total_h = window.innerHeight - 25;
	
	//adjust drawing window
	d3.select( 'svg#' + svgCanvasId ).attr( 'width', _svg_total_w ).attr( 'height', _svg_total_h );

	// create container SVG objects
	this._drawCanvas = d3.select().append( 'g' ); // svg g element where all stitches will be drawn
	this._controlGUI = d3.select().append( 'g' ); // svg g element where all GUI controls will be held

	// // SECOND let's create the components of each project:
	this._nodes = new Array(); // all control nodes in the project
	this._links = new Array(); // all cotnrol links in the project
	// var _stitches = new Array();
	// var _liveStitch; // THE live stitch currently on the hook
	// var _currentDefaultFwdLoop; // THE current default point of hook insertion in the forward-crochet manner
	// var _currentDefaultBckwdLoop;  // THE current default point of hook insertion in the backward-crochet manner
*/
}
