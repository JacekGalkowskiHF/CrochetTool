function CrochetLink( context, type, fromNode, toNode ) {
	
	// local variables for direct and derivative arguments the constructor was called with
	var argLen, argContext, argType, fromNode, toNode; 
	
	// *********************
	// SET STATICS and  CONSTANTS 
	// *********************

	// Create dedicated link numbering sequence
	if ( 'undefined' === typeof CrochetLink.COUNTER ) {
		CrochetLink.COUNTER = new IdGenerator( 'LK' );
	};

	// Define an array of recognized link types
	if ( 'undefined' === typeof CrochetLink.VALID_LINK_TYPES ) {
		CrochetLink.VALID_LINK_TYPES = [
			{
				code: "DEFAULT",
				length: 10
			},
			{
				code: "EXTERNAL",
				length: 10
			},
			{
				code: "SEQUENCE",
				length: 10
			},
			{
				code: "ZERO",
				length: 0,
			},
			{
				code: "CHAINSPACE",
				length: 10,
			},
		];
	};

	// given a string or an index, checks if it's a valid crochetLink type
	CrochetLink.IS_VALID_TYPE_CODE = function( type ) {
		if ( 'string' === typeof( type ) ) {
			return ( CrochetLink.VALID_LINK_TYPES.some( e => ( e.code == type ) ) );
		} else {
			return false;
		}
	};

	CrochetLink.DEF_LENGTH_BY_TYPE = function( type ) {
		// given a string, provided it's a valid  crochetNode type, returns the default length defined for that ink type 
		if ( !( CrochetLink.IS_VALID_TYPE_CODE( type ) ) ) {
			ErrorHandler.throwError( 'CrochetLink 001', type );
		} else {
			return CrochetLink.VALID_LINK_TYPES.find( e => ( e.code === type )  ).length;
		};
	};

	argLen = arguments.length;

	//we need four arguments (context, link type, source node, target node)
	if ( 4 > argLen ) {
		ErrorHandler.throwError( 'CrochetLink 002' );
	};

	argContext = arguments[0]; // will be used later to register the new node in its parent crochetStitch or its parent crochetProject
	argType = arguments[1]; // will be used to set the link's type and also control the creation of other properties
	fromNode = arguments[2]; // to-be source node of the link
	toNode = arguments[3]; // to-be target node of the link
	
	// for each new crochetLink, the context must be set as either the containing crochetStitch or the containing crochetProject
	if ( ! ( argContext instanceof CrochetProject ) && ! ( argContext instanceof CrochetStitch ) ) {
		ErrorHandler.throwError( 'CrochetLink 003' );
	};

	// for each new link its type must be set as one valid types, either by using the type code or type number.
	if ( 'string' !== typeof argType ) {
		ErrorHandler.throwError( 'CrochetLink 004' );
	};
	if ( ! CrochetLink.IS_VALID_TYPE_CODE( argType ) ) {
		ErrorHandler.throwError( 'CrochetLink 005', argType );
	};

	//check form and to nodes are valid
	if ( ! ( fromNode instanceof CrochetNode ) ) {
		ErrorHandler.throwError( 'CrochetLink 006', fromNode.constructor.name );
	};
	if ( ! ( toNode instanceof CrochetNode ) ) {
		ErrorHandler.throwError( 'CrochetLink 007', toNode.constructor.name );
	};
	
	// cannot link one and the same node
	if ( fromNode === toNode ) {
		ErrorHandler.throwError( 'CrochetLink 008' );
	};

	// *********************
	//  PRIVATE PROPERTIES
	// *********************

	// basic
	this._source = fromNode;
	this._target = toNode;
	if ( ( 'string' === typeof( argType ) ) ) {
		this._type = argType;
	} else {
		this._type = CrochetLink.VALID_LINK_TYPES[ argType ].code;
	}
	
	// HOUSEKEEPING - CREATION
	
	// Once everything else was set successfully:
	// 1. link's ID is set
	this._id = CrochetLink.COUNTER.next();
	// 2. node registers the references to other objects
	this._stitch = argContext;
	this._project = argContext.getProject();
	// 3. special case: for new links - register them in the connected nodes
	fromNode.registerLink( this );
	toNode.registerLink( this );
	
	// *********************
	//    PRIVATE METHODS
	// *********************
	
	// HOUSEKEEPING - DELETION
	
	// unregisters the link from its contexts
	this._unRegisterSelf = function() {
		if ( null !== this._stitch ) {
			this._stitch.unRegisterLink( this );
			this._stitch = null;
		}
		if ( null !== this._project ) {
			this._project.unRegisterLink( this );
			this._project = null;
		}
		return null;
	}
	
	// *********************
	//     PUBLIC METHODS
	// *********************

	// unregisters the link form its nodes and then from its contexts
	this.remove = function () {
		this.getSource().unRegisterLink( this );
		this._source = null;
		this.getTarget().unRegisterLink( this );
		this._target = null;
		this._unRegisterSelf();
	}
	
	// overrides the default .toString()
	this.toString = function() {
		return '[CrochetLink ' + this._id + ']';
	}
	
	this.getSource = function() {
		return this._source;
	};

	this.getTarget = function() {
		return this._target;
	};
	
	this.getType = function() {
		return this._type;
	};

	this.getOtherEnd = function( node ) {
		if ( !( node instanceof CrochetNode ) ) {
			ErrorHandler.throwError( 'CrochetLink 009', node.constructor.name );
		};
		if ( this._source === node) {
			return this._target;
		} else if ( this._target === node ) {
			return this._source;
		} else {
			return null;
		};
	};

	// Return the real (geometrical) length of this link
	this.getRealLen = function() {
		return this.getTarget().getAsVector().getSumVector( this.getSource().getAsVector().scale( -1 ) ).getLen();
	};

	// Return the default length of this link, as defined by the available link types
	this.getDefLen = function() {
		return CrochetLink.DEF_LENGTH_BY_TYPE( this._type );
	};

	this.getNeighborhood = function( withEnds ) {
		nodes = this._source.getNeighborNodes().concat( this._target.getNeighborNodes() );
		if ( ! withEnds ) {
			nodes.splice( nodes.indexOf( this._source ), 1 );
			nodes.splice( nodes.indexOf( this._target ), 1 );
		}
		return nodes;
	}
	
	/* TO DO
	 - getLen - depending on node type, get the desired length (could be either defLen OR, in case of chain spaces, sth. more complex)
	*/
	
	this.replaceNode = function( replaced, replacement ) {
		if ( replacement === this._source || replacement === this._target ) {
			ErrorHandler.throwError( 'CrochetLink 011', replacement.toString(), this.toString() );
		};
		if ( replacement.getStitch() !== replaced.getStitch()  ) {
			ErrorHandler.throwError( 'CrochetLink 012', replacement.toString(), replaced.toString() );
		};
		if ( replaced === this._source ) {
			this._source = replacement;
		} else if ( replaced === this._target ) {
			this._target = replacement;
		} else {
			ErrorHandler.throwError( 'CrochetLink 010', replaced.toString(), this.toString() );
		};
		replacement.registerLink( this );
		replaced.unRegisterLink( this );
		return this;
	};
	
	this.getStitch = function() {
		return this._stitch;
	};
	
	this.getProject = function() {
		return this._Project;
	};

}