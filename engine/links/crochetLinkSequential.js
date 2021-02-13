import {crochetLink} from './crochetLink.js'

class crochetLinkSequential extends crochetLink{
    static getType() {return "sequence"}
    static getDeftLen() {return 10}
    static getDesc() {return "connects nodes from the main sequence"}
    static getColor() {return "#333"}
}

export {crochetLinkSequential}
