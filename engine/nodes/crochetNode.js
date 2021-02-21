import {idGenerator} from '../misc/helpers.js'
import {vec2d} from '../misc/vector.js'


class crochetNode {

// *** CLASS STATIC METHODS ***
// and their wrappers to use them in instances

static getType() {return "default"} // unambiguous string for each subclass
getType() {return this.constructor.getType()}

static getDesc() {return "default node class"} // human freindlz class desc.
getDesc() {return this.constructor.getDesc()}

static isLoopable() {return false} // can the node serve as a "loop" node other stitches conenct to
isLoopable() {return this.constructor.isLoopable()}

static getColor() {return "black"} // how to draw the node
getColor() {return this.constructor.getColor()}

constructor(argContext, argCoordinates) {

//  STATIC ATTRIBUTES

// create dedicated node numbering sequence
if ( typeof crochetNode.COUNTER == 'undefined' ) {
  crochetNode.COUNTER = new idGenerator( 'ND' );
};

  // Parse and validate constructor argumetns

if (arguments.length < 2) throw "crochetNode : not enough arguments"

// context where the node will be registered (stitch)
// do I even need it...?
this._context = argContext

if (argCoordinates instanceof Array) {
  if (argCoordinates.length<2) throw "CrochetNode : there must be two coordinatess in coordinates Array";
  if (typeof(argCoordinates[0])!= "number" || typeof(argCoordinates[1])!= "number") throw "CrochetNode : both coordinates must be numbers";
  this.x = argCoordinates[0];
  this.y = argCoordinates[1];
} else if (argCoordinates instanceof vec2d) {
  this.x = argCoordinates.getArray()[0];
  this.y = argCoordinates.getArray()[1];
} else {
  throw "CrochetNode : coordinates must be an Array or vec2d vector";
}

// by default nodes are not fixed in position
this.fx=null;
this.fy=null;

// based on created links, we will keep tracck of nearest neighboring nodes on graph
this._out_neighbors = new Map();
this._in_neighbors = new Map();

// other references
this.id = crochetNode.COUNTER.next();

}

// *** PUBLIC METHODS ***

// if a node is to be removed, it needs to:
// - have all links removed (they self-unregister themselves from their start/end nodes)
// - be un-registered form all contexts
apoptose() {
	this._out_neighbors = undefined;
this._to_neighbors = undefined;
this._context = undefined;
}

getContext() {return this._context}

// overrides the default .toString()
toString() {
	return `[node : ${this.getType()} ${this.id}]`;
}

// Returns the (x,y) position of the node as a Vector object
getVector() {
	return new vec2d( this.x, this.y );
};

// Add a new link to the reference list of all links this node is connected by
registerNeighbor(newLink) {
if (this != newLink.source && this != newLink.target) return false;
if(this == newLink.source) {
  this._out_neighbors.set(newLink, newLink.target)
} else {
  this._in_neighbors.set(newLink, newLink.source);
}
return this;
};

// Removes an existing link from the reference list
unRegisterNeighbor(oldLink) {
	this._in_neighbors.delete(oldLink);
this._out_neighbors.delete(oldLink);
return this;
};

// returns all links associated with this node, filtered by link type and direction
// possible	call arguments: linkType, linkDir
getNeighborLinks(dir="", type="") {

	// where the temp results will be stored
	let links=[];

	// The filtering link direction must be either empty, "IN" or "OUT"
	if (dir!="" && dir !="in" && dir!="out") throw "crochetNode.getNeighborLinks: invalid direction"

	// Get the required links
if (dir=="" || dir=="in") this._in_neighbors.forEach(
  (val, key, map) => ((key.getType()==type||type=="") ? links.push(key) : undefined),
  links
);
if (dir=="" || dir=="out") this._out_neighbors.forEach(
  (val, key, map) => ((key.getType()==type||type=="") ? links.push(key) : undefined),
  links
);

	return links;

};

// Returns all neighbor nodes of this node, filtered by node type and direction of their link
getNeighborNodes(dir="", type="") {

// where the temp results will be stored
	let nodes = [];

	// The filtering link direction must be either empty, "IN" or "OUT"
	if (dir!="" && dir !="in" && dir!="out") throw "crochetNode.getNeighborNodes: invalid direction"

	// Get the required nodes
if (dir=="" || dir =="in") this._in_neighbors.forEach(
  (val, key, map) => ((val.getType()==type||type=="") ? nodes.push(val) : undefined),
  nodes
);
if (dir=="" || dir =="out") this._out_neighbors.forEach(
  (val, key, map) => ((val.getType()==type||type=="") ? nodes.push(val) : undefined),
  nodes
);
	return nodes;

}

getNeighborCount() {
return this._in_neighbors.size + this._out_neighbors.size
}

getArray() {return [this.x, this.y]};

getVector() {return new vec2d(this.x, this.y)};

};

export {crochetNode}
