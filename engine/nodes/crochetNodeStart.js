import {crochetNode} from './crochetNode.js'

class crochetNodeStart extends crochetNode {

  static getType() {return "start"}
  static getDesc() {return "first node of a stitch. Also its first hook"}
  static getColor() {return "green"}

}

export {crochetNodeStart}
