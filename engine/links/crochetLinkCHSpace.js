import {crochetLink} from './crochetLink.js'

class crochetLinkCHSpace extends crochetLink{
    static getType() {return "chains_pace"}
    static getDeftLen() {return 10}
    static getDesc() {return "links in a chainspace"}
}

export {crochetLinkCHSpace}
