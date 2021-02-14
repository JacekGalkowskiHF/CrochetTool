// just a wrapper class to ensure that all crochet oprations speak the same "language"

import {crochetStitch} from '../crochetStitch.js'
import {crochetNode} from '../../nodes/crochetNode.js'

class operationSubject {
    constructor(needle=[], stitch, otherLoops = []) {
        if (!(needle instanceof Array)) throw`crochet operationSubject : needle must be an Array [crochetNode]`
        if (!(otherLoops instanceof Array)) throw`rochet operationSubject : otherLoops must be an Array [crochetNode]`
        this.needleStack = needle.filter(e=>(e instanceof crochetNode))
        this.contextStitch = stitch
        this.otherLoops = otherLoops.filter(e=>(e instanceof crochetNode))
    }

    copy() {
        return new operationSubject(this.needleStack, this.contextStitch, this.otherLoops)
    }

}

export {operationSubject}
