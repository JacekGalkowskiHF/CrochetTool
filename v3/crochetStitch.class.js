function CrochetStitch( ) {
	
	// local variables for direct and derivative arguments the constructor was called with
	var argContext, argType, attachToNode, otherHooks; 
	
	// *********************
	// SET STATICS and  CONSTANTS 
	// *********************

	// Create dedicated link numbering sequence
	if ( 'undefined' === typeof CrochetStitch.COUNTER ) {
		CrochetStitch.COUNTER = new IdGenerator( 'ST' );
	};
	
	// Define an array of recognized stitch types
	if ( 'undefined' === typeof CrochetStitch.VALID_STITCH_TYPES ) {
		CrochetStitch.VALID_STITCH_TYPES = [
			{
				code: "ORIGIN",
				requiredHooks : 0,
				requiresPrevious : false,
				requredHooks: 0,
				sequence: "MAKE ORIGIN",
			},
			{
				code: "CHAIN",
				requiredHooks : 0,
				requiresPrevious : true,
				requredHooks: 0,
				sequence: "LOOP FROM NEEDLE EXTERNAL START LOOP FROM NEEDLE DEFAULT STOP",	
			},
			{
				code: "SC",
				requiredHooks : 0,
				requiresPrevious : true,
				requredHooks: 0,
				sequence: "loop:needle>EXTERNAL>START;loop:needle>INTERNAL>STRUCT;loop:hooks>EXTERNAL>HOOK;loop:needle>INTERNAL>STOP;merge:left",	
			},
		]
	};
			
	// given a string or an index, checks if it's a valid crochetStitch type
	CrochetStitch.IS_VALID_TYPE_CODE = function( type ) {
		if ( 'string' === typeof( type ) ) {
			return ( CrochetStitch.VALID_STITCH_TYPES.some( e => e.code === type) );
		} else {
			return false;
		}
	};
	
	// given a crochetStitch type, checks if it requires a "previous Stitch" to be created
	CrochetStitch.REQUIRES_PREVIOUS = function( type ) {
		if ( ! ( 'string' === typeof( type ) ) ) {
			ErrorHandler.throwError( 'CrochetStitch 006' );
		};
		if ( ! CrochetStitch.IS_VALID_TYPE_CODE( type ) ) {
			ErrorHandler.throwError( 'CrochetStitch 005', type )
		};
		return ( CrochetStitch.VALID_STITCH_TYPES.find( e => ( e.code == type ).requiresPrevious ) );
	};
	
	// given a crochetStitch type, checks how many hooks are required for it to be created
	CrochetStitch.REQUIRED_HOOKS = function( type ) {
		if ( ! ( 'string' === typeof( type ) ) ) {
			ErrorHandler.throwError( 'CrochetStitch 008' );
		};
		if ( ! CrochetStitch.IS_VALID_TYPE_CODE( type ) ) {
			ErrorHandler.throwError( 'CrochetStitch 009', type )
		};
		return ( CrochetStitch.VALID_STITCH_TYPES.find( e => ( e.code == type ).requiresPrevious ) );
	};
	
	// given a crochetStitch type, get creation sequence
	CrochetStitch.GET_SEQUENCE = function( type ) {
		if ( ! ( 'string' === typeof( type ) ) ) {
			ErrorHandler.throwError( 'CrochetStitch 014' );
		};
		if ( ! CrochetStitch.IS_VALID_TYPE_CODE( type ) ) {
			ErrorHandler.throwError( 'CrochetStitch 015', type )
		};
		return ( CrochetStitch.VALID_STITCH_TYPES.find( e => ( e.code == type ).sequence ) );
	};
	
	// parse the creation sequence
	if ( 'undefined' === typeof CrochetStitch.PARSE_SEQUENCE() ) {
		CrochetStitch.PARSE_SEQUENCE = new function( commands, inputLoops, contextStitch ) {
			needleStack = new Array();
			while ( commants.length > 0 ){
				cmd = commands.shift()
				switch( cmd ) {
					case 'MAKE' :
						arg1 = commands.shift();
						n1 = new CrochetNode( arg1 );
						needleStack.push( n1 );
						contextStitch.registerNode( n1 );
						break;
					case 'TAKE' :
						needleStack.push( inputLoops.pop() );
						break;
					case 'FWD' :
					case 'BCK' :
						n1 = needleStack.pop(); // first node
						arg1 = commands.shift(); // link type
						arg2 = commands.shift(); // new node type
						n2 = new CrochetNode( contextStitch, arg2, n1, arg1 ); // create new node
						contextStitch.registerNode( n2 );
						if ( 'FWD' === cmd ) {
							l = new CrochetLink( contextStitch, arg1, n1, n2 ); // create new link
						} else {
							l = new CrochetLink( contextStitch, arg1, n2, n1 ); // create new link
						};
						contextStitch.registerLink( l );
						needleStack.push( n2 );
						break;
					case 'LEFT'  :
					case 'RIGHT' :
						n1 = needleStack.pop(); // first node
						n2 = needleStack.pop(); // second node
						if ( 'LEFT' === cmd ) {
							needleStack.push( n1.mergeWithNode( n2 ) );
						} else {
							needleStack.push( n2.mergeWithNode( n1 ) );
						};
						break;
					case 'REGDEF' :
						contextStitch.registerDefaultPathNode( needleStack[ needleStack.length() ]);
						break;
					case 'SAVE' :
						inputLoops.push( needleStack[ needleStack.length() ] );
						break;
					default:
						ErrorHandler.throwError( 'CrochetStitch 022', cmd );
				};
			};
		};
	};
	
	// *********************
	// VALIDATE CALL ARGUMENTS
	// *********************
	
	// possible constructor calls are as follows:
	// CrochetStitch( argContext, argType, argPreviousNode, argOtherHooks )
	
	argLen = arguments.length;

	//we need exactly four arguments (two of them can be null in a special case)
	if ( 2 > argLen) {
		ErrorHandler.throwError( 'CrochetStitch 001' );
	};

	// argContext will be used later to register the new stitch in its parent crochetProject
	argContext = arguments[0];
	
	// argType will be used to set the stitch's type and also control the creation of other properties
	argType = arguments[1];
	
	// argPreviousNode will be used to attach this stitch to it
	if ( argLen > 2 ) {
		argPreviousNode = arguments[2];
	} else {
		argPreviousNode = null;
	};
	
	// argOtherHooks will be used attach this stitch to other stitches' loops
	if ( argLen > 3 ) {
		argOtherHooks = arguments[2];
	} else {
		argOtherHooks = null;
	};
	
	// for each new CrochetStitch, the context must be set as the containing crochetProject
	if ( ! ( argContext instanceof CrochetProject ) ) {
		ErrorHandler.throwError( 'CrochetStitch 002' );
	};

	// for each new stitch its type must be set as one valid types, using the type code.
	if ( ! ( 'string' === typeof( argType ) ) ) {
		ErrorHandler.throwError( 'CrochetStitch 003' );
	};
	if ( ! ( CrochetStitch.IS_VALID_TYPE_CODE( argType ) ) ) {
		ErrorHandler.throwError( 'CrochetStitch 004', argType );
	};
	
	// unless this is one of a selected list of stitched, it requires a "previous stitch" to attach to.
	if ( CrochetStitch.REQUIRES_PREVIOUS( argType ) && null === argPreviousNode ) {
		ErrorHandler.throwError( 'CrochetStitch 007', argType );
	};
	if ( CrochetStitch.REQUIRES_PREVIOUS( argType ) && argPreviousNode instanceof crochetNode) {
		ErrorHandler.throwError( 'CrochetStitch 010', argType, argPreviousNode.constructor.name );
	};
	
	// do we have enough hooks provided, to create the stitch - an array of crochetNode is expected
	if ( ( CrochetStitch.REQUIRED_HOOKS( argType ) > 0 ) && ( ! ( argOtherHooks instanceof Array ) ) ) {
		ErrorHandler.throwError( 'CrochetStitch 011', argType );
	};
	if ( CrochetStitch.REQUIRED_HOOKS( argType ) < argOtherHooks.length ) {
		ErrorHandler.throwError( 'CrochetStitch 012', argType, argOtherHooks.length );
	};
	if ( ( CrochetStitch.REQUIRED_HOOKS( argType ) > 0 ) && ( argOtherHooks.some( e => ( ! ( e instanceof crochetNode ) ) ) ) ) {
		ErrorHandler.throwError( 'CrochetStitch 013', argType );
	};
	
	// *********************
	//  PRIVATE PROPERTIES
	// *********************
	
	// basic
	this._previousNode = null;
	this._nodes = new Array();
	this._defaultSequenceNodes = new Array();
	this._links = new Array();
	this._project = null;
	
	// temporary
	commandStack = new Array(); // stack of loops (crochetNodes) on the virtual crochet needle
	inputLoopsStack =  argOtherHooks; // stack of loops (crochetNodes) to be worked through;
	
	if ( argPreviousNode !== null ) {
		inputLoopsStack.push( argPreviousNode );	
	};
	
	commandSequence = crochetStitch.GET_SEQUENCE( argType );
	commandStack = creationSequence.split( " " );
	lastLoop = CrochetStitch.PARSE_SEQUENCE( commandStack, inputLoopsStack, this );
	
	// HOUSEKEEPING - CREATION
	
	this._previousNode = argPreviousNode;
	
	// Once everything else was set successfully:
	// 1. stitch's ID is set
	this._id = CrochetStitch.COUNTER.next();
	// 2. node registers the references to other objects
	this._project = argContext;
	
	// *********************
	//    PRIVATE METHODS
	// *********************
	
	// METHOD TO PARSE THE STITCH CREATION SEQUENCE
	
	
	// HOUSEKEEPING - DELETION
	
	// unregisters the stitch from its contexts
	this._unRegisterSelf = function() {
		this._project.unRegisterLink( this );
		return null;
	}
	
	// *********************
	//     PUBLIC METHODS
	// *********************

	// unregisters the link form its nodes and then from its contexts
	this.remove = function () {
		this._nodes.forEach( e => e.remove() );
		this._links.forEach( e => e.remove() );
		this._unRegisterSelf();
	}	

	// overrides the default .toString()
	this.toString = function() {
		return '[CrochetStitch ' + this._id + ']';
	}

	// Returns the code of this stitch's type
	this.getType = function() {
		return this._type;
	}
	
	this.registerNode = function( newNode ) {
		this._nodes.push( newNode );
	}
	
	this.registerDefaultPathNode = function( newNode ) {
		this._defaultSequenceNodes.push( newNode );
	}
	
	this.unRegisterNode = function( oldNode ) {
		this._nodes.splice( this._nodes.indexOf( oldNode ), 1 );
	}
	
	this.registerLink = function( newLink ) {
		this._links.push( newLink );
	}
	
	this.unRegisterLink = function( oldLink ) {
		this._links.splice( this._links.indexOf( oldLink ), 1 );
	}
	
	// overrides the default .toString()
	this.toString = function() {
		return '[CrochetStitch ' + this._id + ']';
	}
	
	this.getProject = function() {
		return this._Project;
	};
	
	this.getNodes = function() {
		
		// possible arguments: nodeType
		var argLen;
		var nodeType;
		// intermediate and final results
		var nodes;
		
		// check if arguments are valid 
		argLen = arguments.length;
		if ( argLen > 1 ) {
			ErrorHandler.throwError( 'CrochetStitch 017', argLen );
		};
		// the filtering nodeType must be either valid or empty
		nodeType = ( argLen = 1) ? arguments[0] : null;
		if ( nodeType !== null  && ! CrochetNode.IS_VALID_TYPE_CODE( nodeType ) ) {
			ErrorHandler.throwError( 'CrochetStitch 018', nodeType );
		}
		
		//results
		nodes = this._nodes
			.filter( e => ( nodeType === null || e._type === nodeType ) )
		return links;
	};
	
	this.getLinks = function() {
		
		// possible arguments: linkType
		var argLen;
		var linkType;
		// intermediate and final results
		var links;
		// check if arguments are valid 
		argLen = arguments.length;
		if ( argLen > 1 ) {
			ErrorHandler.throwError( 'CrochetStitch 019', argLen );
		};
		
		// the filtering nodeType must be either valid or empty
		linkType = ( argLen = 1) ? arguments[0] : null;
		if ( linkType !== null  && ! CrochetLink.IS_VALID_TYPE_CODE( linkType ) ) {
			ErrorHandler.throwError( 'CrochetStitch 020', linkType );
		}
		
		//results
		links = this._links
			.filter( e => ( linkType === null || e._type === linkType ) )
		return links;
	};
	
	this.getStartNode = function() {
		return this.getNodes( 'START' )[0];
	};
	
	this.getEndNode = function() {
		return this.getNodes( 'END' )[0];
	};
	
	this.getPreviousNode = function() {
		return this._previousNode;
	};
	
	this.getPreviousStitch = function() {
		if ( null !== this._previousNode ) {
			return this._previousNode.getStitch();
		} else {
			return null
		};
	}
	
	this.getNextStitch = function() {
		lastNode = this.getEndNode()
		exitingLink = lastNode.getLinks( 'SEQUENCE' )[0];
		if ( null !== l ){
			return exitingLink.getOtherEnd( lastNode ).getStitch();
		} else {
			return null;
		};
	}
	
	this.getFirstLoop() {
		return this._defaultSequenceNodes[0];
	}
	
	this.getNextLoop = function( currentLoop, forceProgress ) {
		// to do: add exception for chain spaces
		loopIndex = this._defaultSequenceNodes.indexOf( curerntLoop );
		if ( -1 == loopIndex ) {
			return this.getFirstLoop();
		} else if ( this._defaultSequenceNodes.length() == loopIndex ) {
			nextStitch = this.getNextStitch();
			if ( null !== nextStitch ) {
				return nextStitch.getFirstLoop();
			} else {
				return null;
			};
		} else {
			this._defaultSequenceNodes[ loopIndex + 1 ];
		};	
	};
};
