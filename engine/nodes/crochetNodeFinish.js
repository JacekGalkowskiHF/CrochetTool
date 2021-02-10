import {crochetNode} from './crochetNode.js'

class crochetNodeFinish extends crochetNode {

  static getType() {return "finish"}
  static getDesc() {return "last node of a stitch. Also its last loop"}
  static isLoopable() {return true}
  static getColor() {return "red"}

}

export {crochetNodeFinish}
