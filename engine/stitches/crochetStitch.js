import {idGenerator} from '../misc/helpers.js'
import {vec2d} from '../misc/vector.js'
import {crochetNode} from '../nodes/crochetNode.js'
import {crochetOperationFactory} from './operations/operationFactory.js'
import {operationSubject} from './operations/operationSubject.js'

class crochetStitch {
    // *** CLASS STATIC METHODS ***
    // and their wrappers to use them in instances

    static getSequence() {return "mk:default:default"} // reciupe how to create stitches internal graph
    getSequence() {return this.constructor.getSequence()}

    static getType() {return "default"} // unambiguous string for each subclass
    getType() {return this.constructor.getType()}

    static getDesc() {return "default stitch class"} // human friendlz description
    getDesc() {return this.constructor.getDesc()}

    static requiresPrevious() {return true} // true if the stitch requires prev. sittches last loop to hook into
    requiresPrevious() {return this.constructor.requiresPrevious()}

    static requiredLoops() {return 0} // how manz other loops are needed to construct the stitch
    requiredLoops() {return this.constructor.requiredLoops()}

    // *** CONSTRUCTOR ***

    constructor(context, attachToNode=null, otherLoops=[]) {

	    // *** STATIC ATTRIBUTES ***

      	// Create dedicated stitch numbering sequence
        if (typeof crochetStitch.COUNTER == 'undefined') {
            crochetStitch.COUNTER = new idGenerator('ST');
        };

        // *** PRIVATE ATTRIBUTES ***

        this._context = context;
        this._nodes = new Map()
        this._links = new Map()
        this.id = crochetStitch.COUNTER.next()

        // validate call parameters
        if (this.requiresPrevious() && attachToNode == null) throw "crochetStitch : prev. stitch was required, but not provided"
        if (attachToNode != null && !(attachToNode instanceof crochetNode)) throw `crochetStitch : attachToNode must be an instance o crochetNode. Got: ${attachToNode.constructor.name}`
        let loops = otherLoops.filter(e=>(e instanceof crochetNode)) // also a shallow copy
        if (loops.length < this.requiredLoops()) throw "crochetStitch: not enough other loops"

        // setup stitch creation parameters
        let seq = this.getSequence().split(";").map(e=>e.trim())
        let needle = []
        needle.push(attachToNode)
        let instr = ""

        let subject = new operationSubject(needle, this, loops)

        // create the stitch'es nodes and links according to the dequence

        while (instr = seq.shift()){

            let tokens = instr.split(":").map(e=>e.trim())
            let action = tokens.shift()
            let op = crochetOperationFactory.getNewObject(action, subject, tokens)
            let res = op.exec()

            subject = res.newSubject

            if (res.newNode) this._nodes.set(res.newNode)
            if (res.newLink) this._links.set(res.newLink)
            if (res.delNode) {
                res.delNode
                    .getNeighborLinks()
                    .forEach(e => {
                        e.apoptose()
                        this._links.delete(e)
                    });
                this._nodes.delete(res.delNode)
            }
            if (res.delLink) this._links.delete(res.delLink)

        }
    }

     // *** PUBLIC METHODS ***

    // overrides the default .toString()
	toString() {
		return '[CrochetStitch ' + this._id + ']';
	}

    getNodes(nodeType) {
        let nodes = Array
            .from(this._nodes.keys())
			.filter(e => (nodeType ==null ||e.getType() == nodeType))
		return nodes;
    };

	getLinks(linkType) {
        let links = Array
            .from(this._links.keys())
			.filter(e => (linkType == null || e.getType() == linkType))
		return links;

	};

	getStartNode() {
        return (this.getType() == "origin") ? this.getNodes()[0] : this.getNodes('start')[0];
	};

	getEndNode() {
        return (this.getType() == "origin") ? this.getNodes()[0] : this.getNodes( 'finish' )[0];
	};

	getPreviousStitch() {
        return this.getStartNode.getNeighborNodes("in","finish").getContext()
	}

    getNextStitch() {
		return this.getEndNode.getNeighborNodes("out","start").getContext()
	}

	getFirstLoop() {

        let wrk_node = this.getStartNode() // start at the beginning
        let same_stitch = this;

        while(wrk_node.getContext() == same_stitch) {
            // if possible,  return a "loop" node
            if (wrk_node.isLoopable()) return wrk_node
            // otherwise, proceed to next node in main sequence
            let next_stchs = wrk_node.getNeighborLinks("out", "sequence")
            if (next_stchs.length>0) {
                wrk_node = next_stchs[0].getOtherEnd(wrk_node)
            } else {
                return false // nothing was found :(
            }
        }

        return false // nothing was found :(
	}

    getLastLoop() {

        let wrk_node = this.getEndNode() // start at the beginning
        let same_stitch = this;

        while(wrk_node.getContext() == same_stitch) {
            // if possible,  return a "loop" node
            if (wrk_node.isLoopable()) return wrk_node
            // otherwise, proceed to next node in main sequence
            let next_stchs = wrk_node.getNeighborLinks("in", "sequence")
            if (next_stchs.length>0) {
                wrk_node = next_stchs[0].getOtherEnd(wrk_node)
            } else {
                return false // nothing was found :(
            }
        }

        return false // nothing was found :(
	}

	getNextLoop( currentLoop, forceProgress ) {

		// to do: add exception for chain spaces

        let wrk_node = currentLoop // start somewhere
        let cont = true

        while(cont) {
            // proceed to next node in main sequence
            let next_stchs = wrk_node.getNeighborLinks("out", "sequence")
            if (next_stchs.length>0) {
                // if possible,  return a "loop" node
                wrk_node = next_stchs[0]
                if (wrk_node.isLoopable()) return wrk_node
            } else {
                // if no more nodes, stop the search
                cont = false
            }
        }

        return false // nothing was found :(
	}
}

export {crochetStitch}
