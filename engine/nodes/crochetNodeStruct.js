import {crochetNode} from './crochetNode.js'

class crochetNodeStruct extends crochetNode {

  static getType() {return "struct"}
  static getDesc() {"a node that is only there for structure modeling (neither LOOP, nor HOOK)"}
  static getColor() {return "darkgray"}

}

export {crochetNodeStruct}
