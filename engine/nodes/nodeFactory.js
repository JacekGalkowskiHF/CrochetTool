import vec2d from './vectorClass.js'
import {}

class nodeFactoryClass {

  constructor() {
    this.nodeTypes = new Map()
  }

  registerNodeType(nodeClass){
    this.nodeTypes.set(nodeClass.getType(), nodeClass)
    return this
  }

  getNode(argType, argContext, argCoordinates){
    let cls = this.nodeTypes.get(argType)
    if (typeof cls == "undefined") throw `nodeFactory : invalid node type ${argType}`
    return new cls(argContext, argCoordinates)
  }

  getNodeClass(argType){
    let cls = this.nodeTypes.get(argType)
    if (typeof cls == "undefined") throw `nodeFactory : invalid node type ${argType}`
    return cls
  }

  isValidNodeType(type){
    return this.nodeTypes.has(type)
  }
}

// nodeFactory = new nodeFactoryClass()
//    .registerNodeType(crochetNode)
//    .registerNodeType(crochetNodeOrigin)
//    .registerNodeType(crochetNodeStart)
//    .registerNodeType(crochetNodeStruct)
//    .registerNodeType(crochetNodeFinish)
//    .registerNodeType(crochetNodeLoop)
//    .registerNodeType(crochetNodeHook)
//    .registerNodeType(crochetNodeCHSpaceStart)
//    .registerNodeType(crochetNodeCHSpaceCont)
//
// export nodeFactory;
