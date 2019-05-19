function CrochetNode() {
	
	// local variables for direct and derivative arguments the constructor was called with
	var argLen, argContext, argType, createMode
	var argCoordinates;
	var argFromNode, argAlongLink, argLinkLength;
	var argNodeArray, argAcrossLink, argFirstLinkLength, argSecondLinkLength;
	var numOfNodes, centerOfMass, p1, p2, tangent, normal, refLen, tLen, nLen;
	var newXY;
	
	// *********************
	// SET STATICS and  CONSTANTS 
	// *********************
	
	// create dedicated node numbering sequence
	if ( typeof CrochetNode.COUNTER == 'undefined' ) {
		CrochetNode.COUNTER = new IdGenerator( 'ND' );
	};

	// define an array of recognized node types and their parameters
	if ( typeof CrochetNode.VALID_NODE_TYPES == 'undefined' ) {
		CrochetNode.VALID_NODE_TYPES = [
			{
				// the first node in the crochetProject
				code: 'ORIGIN',
			},
			{
				// first node of a stitch. Also its first hook
				code: 'START',
			},
			{
				// last node of a stitch. Also its last loop
				code: 'FINISH',
			},
			{
				// a node that other stitches' hooks can attach to
				code: 'LOOP',
			},
			{
				// a node that must attach to other stitches' loops
				code: 'HOOK',
			},
			{
				// a node that is only there for structure modeling
				code: 'STRUCT',
			},
			{
				// first (not removable) loop of a 'chain space'
				// the only node in a chain space to carry with itself information about its total length
				code: 'CH_SP_START',
			},
			{
				// any subsequent node of a "chain space"
				code: 'CH_SP_CONT',
			},
		];
	};

	// given a string , checks if it's a valid CrochetNode type	
	CrochetNode.IS_VALID_TYPE_CODE = function( type ) {
		if ( 'string' == typeof( type ) ) {
			return CrochetNode.VALID_NODE_TYPES.some( e => ( e.code === type ) );
		} else {
			return false;
		}
	};

	// *********************
	// VALIDATE CONSTRUCTOR ARGUMENTS
	// *********************

	// possible constructor calls are as follows:
	// CrochetNode( context, nodeType ) - creates a node of specified type at the default position (0,0)
	// CrochetNode( context, nodeType, [ x, y ] ) - creates a node of specified type at the position (x,y)	
	// CrochetNode( context, nodeType, fromNode, {linkType|linkLength} ) - creates a node of specified type in a distance determined by the given linkType or linkLength away from fromNode, on the opposite side of that node than its all neighbors
	// CrochetNode( context, nodeType, fromNode, prevLink, {linkType|linkLength} ) - creates a new node, that is placed in line with prevLink, in a distance from fromNode determined by the given linkType or linkLength
	// CrochetNode( context, nodeType, refNodeArray, referenceLink, {linkType1|linkLength1}, {linkType2|linkLength2} ) - creates a new node, that is placed in a distances determined by the given linkTypes or linkLengths from ends of referenceLink, and on the opposite side of that link, than the center of mass of all nodes in refNodeArray is

	argLen = arguments.length;

	//we need minimum of two arguments (context and node type)
	if ( 2 > argLen) {
		ErrorHandler.throwError( 'CrochetNode 001' );
	};

	// argContext will be used later to register the new node in its parent CrochetStitch or its parent crochetProject
	argContext = arguments[0];
	
	// argType will be used to set the node's type and also control the creation of other properties
	argType = arguments[1];
	
	// for each new CrochetNode, the context must be set as either the containing CrochetStitch or the containing crochetProject
	if ( ! ( argContext instanceof CrochetProject ||  argContext instanceof CrochetStitch) ) {
		ErrorHandler.throwError( 'CrochetNode 002' );
	};

	// for each new node its type must be set as one valid types, either by using the type code or type number.
	if ( ! ( 'string' === typeof( argType ) ) ) {
		ErrorHandler.throwError( 'CrochetNode 003' );
	};
	if ( ! ( CrochetNode.IS_VALID_TYPE_CODE( argType ) ) ) {
		ErrorHandler.throwError( 'CrochetNode 004', argType );
	};

	// here we validate if, given a specific number of arguments, each argument is of the correct type and value
	// In case they are valid we set some temporary variables
	switch ( argLen ) {
		
		// only context and nodeType were given
		case 2:
			createMode = "standalone";
			break;
		
		// called as: CrochetNode( context, nodeType , [ x, y ] )
		case 3:
			
			// Coordinates of a node cannot be set the to (x,y) if these are not a two-element array of numbers
			if ( ! ( arguments[2] instanceof Array ) ) {
				ErrorHandler.throwError( 'CrochetNode 005', arguments[2].constructor.name );
			};
			if ( arguments[2].length < 2 ) {
				ErrorHandler.throwError( 'CrochetNode 009' );
			};
			if ( ! ( 'number' === typeof arguments[2][0] && 'number' === typeof arguments[2][1] ) ) {
				ErrorHandler.throwError( 'CrochetNode 032' );
			};
			
			// When everything is valid, set call variables
			createMode = "pinpoint";
			argCoordinates = arguments[2];
			break;
		
		// called as: CrochetNode( context, type, fromNode, linkType | linkLength )
		case 4:
		
			// Existing link cannot be extended if the start position (fromNode) is not a CrochetNode
			if ( ! ( arguments[2] instanceof CrochetNode ) ) {
				ErrorHandler.throwError( 'CrochetNode 026', arguments[2].constructor.name );
			};
			
			// Existing link cannot be extended if the extension type (linkType) is not a valid link type code or valid length (linkLength) a number
			if ( ! ( 'number' == typeof( arguments[3] ) || 'string' == typeof( arguments[3] ) ) ) {
				ErrorHandler.throwError( 'CrochetNode 027', arguments[3].constructor.name );
			};
			if ( 'string' == arguments[3] && ! ( crocehtLink.IS_VALID_TYPE_CODE( arguments[3] ) ) ) {
				ErrorHandler.throwError( 'CrochetNode 028', arguments[3].constructor.name );
			};
			
			break;
			
		// called as: CrochetNode( context, type, fromNode, alongLink, linkType | linkLength )
		case 5:
			
			// The start position (fromNode) must be a CrochetNode
			if ( ! ( arguments[2] instanceof CrochetNode ) ) {
				ErrorHandler.throwError( 'CrochetNode 006', arguments[2].constructor.name  );
			};
			
			// The reference link (prevLink) must be a CrochetLink
			if ( !( arguments[3] instanceof CrochetLink ) ) {
				ErrorHandler.throwError( 'CrochetNode 007', arguments[3].constructor.name );
			};
			
			// The extension type (linkType) must be a valid link type code OR valid length (linkLength) a number
			if ( ! ( 'number' == typeof( arguments[4] ) || 'string' == typeof( arguments[4] ) ) ) {
				ErrorHandler.throwError( 'CrochetNode 008', arguments[4].constructor.name );
			};
			if ( 'string' == arguments[4] && ! ( crocehtLink.IS_VALID_TYPE_CODE( arguments[4] ) ) ) {
				ErrorHandler.throwError( 'CrochetNode 009', arguments[4].constructor.name );
			};
			
			// When everything is valid, set call variables
			createMode = "extension";
			argFromNode = arguments[2];
			argAlongLink = arguments[3];
			if ( 'number' == typeof( arguments[4] ) ) {
				argLinkLength = arguments[4];
			} else {
				argLinkLength = arguments[4];
				argLinkLength = CrochetLink.DEF_LENGTH_BY_TYPE( arguments[4] );
			};
			break;
		
		// Called as: CrochetNode( context, nodeType, nodeArray, referenceLink, {linkType1|linkLength1}, {linkType2|linkLength2} )
		case 6:
			
			// The third argument must be an array of other nodes constituting the "counter weight" to the new node
			if ( ! ( arguments[2] instanceof Array ) ) {
				ErrorHandler.throwError( 'CrochetNode 010', arguments[2].constructor.name );
			};
			
			// The fourth argument must be a reference axis, across which the counter-direction will be calculated
			if ( !( arguments[3] instanceof CrochetLink ) ) {
				ErrorHandler.throwError( 'CrochetNode 011', arguments[3].constructor.name );
			};
			
			// The distances of the new node form the ends of the reference link must be specified as either link type codes or link lengths
			if ( 'number' !== typeof( arguments[4] ) && 'string' !== typeof( arguments[4] ) ) {
				ErrorHandler.throwError( 'CrochetNode 012', arguments[4].constructor.name );
			};
			if ( 'number' !== typeof ( arguments[5] ) && 'string' !== typeof( arguments[5] ) ) {
				ErrorHandler.throwError( 'CrochetNode 013', arguments[5].constructor.name );
			};
			
			// Distances specified as link type codes, must be valid link types.
			if ( 'string' == arguments[4] && ! CrochetLink.IS_VALID_TYPE_CODE( arguments[4] ) ) {
				ErrorHandler.throwError( 'CrochetNode 014', arguments[4] );
			};
			if ( 'string' == arguments[5] && ! CCrochetLink.IS_VALID_TYPE_CODE( arguments[5] ) ) {
				ErrorHandler.throwError( 'CrochetNode 015', arguments[5] );
			};
			
			// All the elements of the counter weight array must be instances of CrochetNode
			var nodeArrayIsValid = true;
			var nodesValidityFlags = arguments[2].map( e => ( e instanceof CrochetNode ) );
			nodesValidityFlags.forEach( e => { nodeArrayIsValid = nodeArrayIsValid && e; } );
			if ( ! nodeArrayIsValid ) {
				ErrorHandler.throwError( 'CrochetNode 016' );
			};
			
			// When everything is valid, set call variables
			createMode = 'split';
			argNodeArray = arguments[2];
			argAcrossLink = arguments[3];
			if ( 'number' == typeof( arguments[4] ) ) {
				argFirstLinkLength = arguments[4];
			} else {
				argFirstLinkLength  = CrochetLink.DEF_LENGTH_BY_TYPE( arguments[4] );
			};
			if ( 'number' == typeof( arguments[5] ) ) {
				argSecondLinkLength = arguments[5];
			} else {
				argSecondLinkLength  = CrochetLink.DEF_LENGTH_BY_TYPE( arguments[5] );
			};	
			break;
			
		// An other case means we have an unsupported number of arguments
		default:
			ErrorHandler.throwError( 'CrochetNode 017', argLen );
			break;
	};

	// *********************
	// PRIVATE PROPERTIES
	// *********************

	// Array of all neighboring links
	this._links = new Array();
	
	// node type always as a string code
	this._type = ( 'string' === typeof( argType ) ) ?
		argType :
		CrochetNode.VALID_NODE_TYPES[ argType ].code;
	
	// At this point we have all information needed to set the node's initial position
	switch( createMode ) {
		
		// Easiest cases: we place the node directly at given coordinates
		case 'standalone':
			newXY = [ 0, 0 ];
			break;
		case 'pinpoint':
			newXY = argCoordinates;
			break;
		
		// The node is placed along a link that is "extended" from one of its nodes
		case 'extension':
		
			// the "from" node must be one of the nodes of the link being extended
			// then the other node is also noted for reference
			if ( argAlongLink.getSource() === argFromNode ) {
				p1 = argAlongLink.getTarget().getAsVector();
				p2 = argFromNode.getAsVector();
			} else if ( argAlongLink.getTarget() === argFromNode ) {
				p1 = argAlongLink.getSource().getAsVector();
				p2 = argFromNode.getAsVector();
			} else {
				ErrorHandler.throwError( 'CrochetNode 018' );
			};
			newXY = p2.getSumVector( p2.getSumVector( p1.scale( -1 ) ).setLen( argLinkLength ) ).getArray();
			break;
		
		// The node is placed as if it was created as a break in an existing link, 
		// splitting that link into two parts with given link lengths.
		// It is important to try and place the new node on the opposite side from all the other 
		// neighboring nodes of the reference link.
		// The placement itself is attempted so that the "original" link and the two "new" links create a valid triangle.
		case "split":
		
			// First we determine the center of mass of all nodes given as "counter weight"
			numOfNodes = argNodeArray.length;
			centerOfMass = new Vector( 0, 0 );
			argNodeArray
				.forEach( e => { centerOfMass = centerOfMass.getSumVector( new Vector( e.x, e.y ) ) } );
			if ( numOfNodes > 0 ) {
				centerOfMass.scale ( 1 / numOfNodes );
			};
			
			// Determine base vectors:
			// - tangent to the reference link 
			// - normal to the ref. link, so that it points away from the center of mass
			p1 = argAcrossLink.getSource().getAsVector();
			p2 = argAcrossLink.getTarget().getAsVector();
			tangent = p2.getSumVector( p1.scale( -1 ) ).getBaseA();
			normal = tangent.getProjectionOf( centerOfMass.getSumVector( p1.scale( -1 ) ), true ).scale( -1 ).setLen( 1 );
			
			// Check if the triangle conditions are met
			// and calculate relative position of the new node accordingly
			refLen = argAcrossLink.getRealLen();
			
			// reference link too short to form a triangle with the new two links
			if ( Math.abs( argFirstLinkLength - argSecondLinkLength ) >  refLen ) {
				
				// the longer new link determines the position
				if ( argFirstLinkLength > argSecondLinkLength ) {
					tLen = argFirstLinkLength;
					nLen = 0;
				} else {
					tLen = refLen - argSecondLinkLength;
					nLen = 0;
				}
			
			// triangle  conditions met - solve the triangle	
			} else if ( ( argFirstLinkLength + argSecondLinkLength ) > refLen ) {
				tLen = ( refLen**2 + argFirstLinkLength**2 - argSecondLinkLength**2 )/( 2 * refLen );
				nLen = Math.sqrt( argFirstLinkLength**2 - tLen**2 );
				
			// reference link to long - scale down the proposed link lengths proportionally and put node along the tangent base
			} else {
				tLen = argFirstLinkLength * refLen / ( argFirstLinkLength + argSecondLinkLength );
				nLen = 0;
			};
			
			// set the absolute position of the new node
			newXY = p1.getSumVector( tangent.setLen( tLen ) ).getSumVector( normal.setLen( nLen ) ).getArray();
			break;
	};
	
	this.x = newXY[0];
	this.y = newXY[1];
	
	this._fixed = ( 'ORIGIN' === this._type );
	
	// HOUSEKEEPING - CREATION
	
	// Once everything else was set successfully:
	// 1. node's ID is set
	this._id = CrochetNode.COUNTER.next();
	// 2. node registers the references to other objects
	this._stitch = argContext;
	this._project = argContext.getProject();
	
	// *********************
	//    PRIVATE METHODS
	// *********************	
	
	// HOUSEKEEPING - DELETION
	
	// housekeeping: un-registers this link from all its registered contexts
	this._unRegisterSelf = function() {
		if ( null !== this._stitch ) {
			this._stitch.unRegisterNode( this );
			this._stitch = null;
		}
		if ( null !== this._project ) {
			this._project.unRegisterNode( this );
			this._project = null;
		}
		return null;
	}
	
	// *********************
	//    PUBLIC METHODS
	// *********************

	// if a node is to be removed, it needs to:
	// - have all links removed (they self-unregister themselves from their start/end nodes)
	// - be un-registered form all contexts
	this.remove = function () {
		while ( this._links.length > 0 ) {
			this._links[0].remove();
		}; 
		this._unRegisterSelf();
	}
	
	// overrides the default .toString()
	this.toString = function() {
		return '[CrochetNode ' + this._id + ']';
	}
	
	// Returns the (x,y) position of the node as a Vector object
	this.getAsVector = function() {
		return new Vector( this.x, this.y );
	};

	// Returns the code of this node's type
	this.getType = function() {
		return this._type;
	}
	
	// Add a new link to the reference list of all links this node is connected by
	this.registerLink = function ( newLink ) {
		if ( newLink instanceof CrochetLink ) {
			this._links.push( newLink );
		};
		return this;
	};
	
	// Removes an existing link from the reference list
	this.unRegisterLink = function( oldLink ) {
		
		this._links.splice( this._links.indexOf( oldLink ), 1 );
		
		// If, after removing all the links, the node is left with no neighbors, it should be deleted
		// unless this node is the origin of the project
		if ( 0 === this._links.lenght && "ORIGIN" !== this._type ) {
			this.remove();
			return null;
		} else {
			return this;
		};
	};

	// returns all links associated with this node, possibly filtered by node type and direction
	// possible	call arguments: linkType, linkDir		
	this.getNeighborLinks = function(  ) {
		var argLen;
		var linkType = null; linkDir = null;
		
		// where the results will be stored
		var links;
		
		// check if arguments are valid 
		argLen = arguments.length;
		if ( argLen > 2 ) {
			ErrorHandler.throwError( 'CrochetNode 019', argLen );
		};
		
		// The filtering link type must be either valid or empty
		linkType = ( argLen >= 1 ) ? arguments[0] : null;
		if ( ! ( linkType === null ) && ! CrochetLink.IS_VALID_TYPE_CODE( linkType ) ) {
			ErrorHandler.throwError( 'CrochetNode 029', linkType );
		}
		
		// The filtering link direction must be either empty, "IN" or "OUT"
		linkDir = ( argLen >= 2 ) ? arguments[1] : null;
		if ( linkDir !== null  && 'string' !== typeof( linkDir ) ) {
			ErrorHandler.throwError( 'CrochetNode 020', typeof( linkDir ) );
		}
		if ( 'string' === typeof( linkDir ) && ( ! ( 'IN' === linkDir || 'OUT' === linkDir ) ) ) {
			ErrorHandler.throwError( 'Crochetnode 021', linkDir );
		}
		
		// Get the required links
		links = this._links
			.filter( e => ( linkType === null || e._type === linkType ) )
			.filter( e => (
				null === linkDir ||
				( 'IN' === linkDir && this === e.getTarget() ) ||
				( 'OUT' === linkDir && this === e.getSource() )
			) )
		return links;
	};
	
	// Returns all neighbor nodes of this node, possibly filtered by node type and type and direction of the connecting link
	this.getNeighborNodes = function() {
		
		// possible arguments: nodeType, linkType, linkDir
		var argLen;
		var nodeType, linkType, linkDir;
		
		// intermediate and final results
		var links, nodes;
		
		// check if arguments are valid 
		argLen = arguments.length;
		if ( argLen > 3 ) {
			ErrorHandler.throwError( 'CrochetNode 022', argLen );
		};
		
		// the filtering nodeType must be either valid or empty
		nodeType = ( argLen >= 1) ? arguments[0] : null;
		if ( nodeType !== null  && ! CrochetNode.IS_VALID_TYPE_CODE( nodeType ) ) {
			ErrorHandler.throwError( 'CrochetNode 030', nodeType );
		}
		
		// The filtering linkType must be either valid or empty
		linkType = ( argLen >= 2) ? arguments[1] : null;
		if ( linkType !== null && ! CrochetLink.IS_VALID_TYPE_CODE( linkType ) ) {
			ErrorHandler.throwError( 'CrochetNode 031', linkType );
		}
		
		// the filtering LinkDir must be either valid or empty
		linkDir = ( argLen >= 3 ) ? arguments[2] : null;
		if ( linkDir !== null && 'string' !== typeof( linkDir ) ) {
			ErrorHandler.throwError( 'CrochetNode 024', typeof( linkDir ) );
		}
		if ( linkDir !== null &&  "IN" !== linkDir && "OUT" !== linkDir ) {
			ErrorHandler.throwError( 'CrochetNode 025', linkDir );
		}
		
		// Get the filtered links and then their opposite nodes
		links = this.getNeighborLinks( linkType, linkDir );
		nodes = links
			.map( e => e.getOtherEnd( this ) )
			.filter( e => null === nodeType || nodeType === e.getType() );
		return nodes;
	};
	
	this.getStitch = function() {
		return this._stitch;
	};
	
	this.getProject = function() {
		return this._Project;
	};
	
	this.mergeWithNode = function( node ){
		
		if ( ! ( node instanceof CrochetNode ) ) {
			ErrorHandler.throwError( 'CrochetNode 033', typeof( node ) );
		} else if ( this === node  ) {
			ErrorHandler.throwError( 'CrochetNode 034' );
		};
		
		/* linksToChange = node.getNeighborLinks();
		for ( i = 0; i < linksToChange.lenght(); i++ ) {
			linksToChange[i].replaceNode( node, this );
		}; */
		
		node.getNeighborLinks().forEach( l => {l.replaceNode( this[0], this[1] );}, [ node, this ] );
		node.remove();
		
		return this;
	};
	
};