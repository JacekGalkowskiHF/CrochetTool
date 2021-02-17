import {crochetLink} from './crochetLink.js'

class crochetLinkExternal extends crochetLink{
  static getType() {return "external"}
  static getDeftLen() {return 10}
  static getDesc() {return "connects a nodes from two distinct stitches"}
}

export {crochetLinkExternal}
