import {crochetStitch} from './crochetStitch.js'

class crochetStitchSingle extends crochetStitch {

    static getSequence() {return "mk:external:start; mk:sequence:finish; mv:other; mk:external:hook; mk:default:loop; merge:right"}
    static getType() {return "sc"}
    static getDesc() {return "single crochet"}
    static requiresPrevious() {return true}
    static requiredLoops() {return 1}

}

export {crochetStitchSingle}
