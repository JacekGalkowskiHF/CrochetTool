import {crochetNode} from './crochetNode.js'

class crochetNodeCHSpaceStart extends crochetNode {

  static getType() {return "ch_sp_start"}
  static getDesc() {return  "first (not removable) loop of a 'chain space'. It carries ch.sp. total len."}
  static getColor() {return "yellow"}

}

export {crochetNodeCHSpaceStart}
