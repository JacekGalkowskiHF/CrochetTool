import {factoryClass} from '../misc/factory.js'
import {crochetNode} from './crochetNode.js'

let crochetNodeFactory = new factoryClass(crochetNode, "getType")

import {crochetNodeOrigin} from './crochetNodeOrigin.js'
import {crochetNodeStart} from './crochetNodeStart.js'
import {crochetNodeFinish} from './crochetNodeFinish.js'
import {crochetNodeHook} from './crochetNodeHook.js'
import {crochetNodeLoop} from './crochetNodeLoop.js'
import {crochetNodeStruct} from './crochetNodeStruct.js'
import {crochetNodeCHSpaceStart} from './crochetNodeCHSpaceStart.js'
import {crochetNodeCHSpaceCont} from './crochetNodeCHSpaceCont.js'

crochetNodeFactory
    .registerClass(crochetNodeOrigin)
    .registerClass(crochetNodeStart)
    .registerClass(crochetNodeFinish)
    .registerClass(crochetNodeHook)
    .registerClass(crochetNodeLoop)
    .registerClass(crochetNodeStruct)
    .registerClass(crochetNodeCHSpaceStart)
    .registerClass(crochetNodeCHSpaceCont)

export {crochetNodeFactory}
