import {idGenerator} from '../misc/helpers.js'
import {vec2d} from '../misc/vector.js'

class crochetLink{

    // *** CLASS STATIC METHODS ***
    // and their wrappers to use them in instances

    static getDefLen() {return 10} // link lenght for ForceLayout simulation
    getDefLen() {return this.constructor.getDefLen()}

    static getType() {return "default"} // unambiguous string for each subclass
    getType() {return this.constructor.getType()}

    static getDesc() {return "default link class"} // human friendly desc.
    getDesc() {return this.constructor.getDesc()}

    static isPrintable() {return false} // should it be drawn in documents
    isPrintable() {return this.constructor.isPrintable()}

    static getColor() {return "lightgray"} // how to draw it
    getColor() {return this.constructor.getColor()}

    // *** CONSTRUCTOR ***

    constructor(context, fromNode, toNode, length = undefined) {

        // *** STATIC ATTRIBUTES ***

        // Create dedicated link numbering sequence
        if ( typeof crochetLink.COUNTER == 'undefined' ) {
            crochetLink.COUNTER = new idGenerator( 'LK' );
        };

        // *** PRIVATE ATTRIBUTES ***

        // basic
        this.source = fromNode;
        this.target = toNode;
        this._context = context;
        //for future: removing nodes form simulation without destrying the objects => ready for u-do action
        this.is_deleted = false;

        // physics
        if (length == undefined) {
            this._length = this.constructor.getDefLen();
        } else {
            if (!typeof(length)=="number") throw "length must be a number";
            this._length = length;
        }

        // references
        this.id = crochetLink.COUNTER.next();

        // *** HOUSEKEEPING - CREATION ***
        fromNode.registerNeighbor(this);
        toNode.registerNeighbor(this);

    }

    // methods needed for D3JS simulation
    strength() {
        return (this.is_deleted) ? 0 : 1;
    }

    // *** PUBLIC METHODS ***

    // if a link is to be removed, it needs to:
	// - be remove from neighbors list and clear its references
	// - be un-registered form all contexts
    apoptose() {
    	this.source.unRegisterNeighbor(this);
        this.target.unRegisterNeighbor(this);
        this.source = undefined;
        this.target = undefined;
        this._context = undefined;
    }

    getContext() {return this._context}

    // overrides the default .toString()
	toString() {
		return '[CrochetLink ' + this.id + ']';
	}

	getOtherEnd( node ) {
		if ( this.source === node) {
			return this.target;
		} else if ( this.target === node ) {
			return this.source;
		} else {
			return false;
		};
	};

	// Return the real (geometrical) length of this link
	getRealLen() {
		return this.source.getVector().sub(this.target.getVector()).len();
	};

    // wrapper for the getRealLen that can return derivatives, that depend on neighborhood
    // will be used in "chainspace" stitches
    getLen() {
        return this.getDefLen();
    }

    // get all neighbouring nodes of the two connected nodes
	getNeighborhood( withEnds=true ) {
		let nodes = this.source.getNeighborNodes().concat( this.target.getNeighborNodes() );
		if ( withEnds ) {
			nodes = nodes
                .concat(this.target)
                .concat(this.source)
		}
		return nodes;
	}

    // replace one of the connected nodes
	replaceNode( oldNode, newNode ) {

        if ( newNode == this.source || newNode == this.target ) throw "crocherLink.replaceNode : new node not distinct"
        if ( oldNode != this.source && oldNode != this.target ) throw "crocherLink.replaceNode : old node not from link"
        if ( oldNode._context != newNode._context) throw  "crocherLink.replaceNode : both nodes must be fro msmae Stitch"

		if ( oldNode == this.source ) {
			this.source = newNode;
		} else if ( oldNode === this.target ) {
			this.target = newNode;
		};

		newNode.registerNeighbor(this);
		oldNode.unRegisterNeighbor(this);

		return this;
	};

    // for d3.js Force
    strength() {
        return 1 / Math.min(this.source.getNeighborCount(), this.target.getNeighborCount());
    }

}

export {crochetLink}
