import {crochetNode} from './crochetNode.js'

class crochetNodeHook extends crochetNode {

  static getType() {return "hook"}
  static getDesc() {return "a node that must attach to other stitches' loops"}
  static getColor() {return "brown"}

}

export {crochetNodeHook}
