import {crochetLink} from './crochetLink.js'

class crochetLinkZero extends crochetLink{
    static getType() {return "zero"}
    static getDeftLen() {return 0}
    static getDesc() {return "zero-lenght link"}
}

export {crochetLinkZero}
