import {crochetStitch} from './crochetStitch.js'

class crochetStitchOrigin extends crochetStitch {

    static getSequence() {return "makeorigin"}
    static getType() {return "origin"}
    static getDesc() {return "first stitch in any doily. should be only one in the whole doily."}
    static requiresPrevious() {return false}
    static requiredLoops() {return 0}

}

export {crochetStitchOrigin}
