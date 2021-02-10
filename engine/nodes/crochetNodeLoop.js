import {crochetNode} from './crochetNode.js'

class crochetNodeLoop extends crochetNode {
  // constructor(context, position){super(context, position)}
  static getType() {return "loop"}
  static getDesc() {return "a node that other stitches' hooks can attach to"}
  static isLoopable() {return true}
  static getColor() {return "blue"}
}

export {crochetNodeLoop}
