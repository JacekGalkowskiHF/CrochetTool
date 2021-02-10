import {crochetNode} from './crochetNode.js'

class crochetNodeCHSpaceCont extends crochetNode {
  static getType() {return "ch_sp_cont"}
  static getDesc() {return "any subsequent node of a 'chain space'"}
  static getColor() {return "violet"}
}

export {crochetNodeCHSpaceCont}
