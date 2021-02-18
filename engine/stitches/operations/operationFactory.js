import {factoryClass} from '../../misc/factory.js'
import {crochetOperation} from './crochetOperation.js'


let crochetOperationFactory = new factoryClass(crochetOperation, "getCommandName")

import {crochetOperationMakeOrigin} from './crochetOperationMakeOrigin.js'
import {crochetOperationBasic} from './crochetOperationBasic.js'
import {crochetOperationCopy} from './crochetOperationCopy.js'
import {crochetOperationMove} from './crochetOperationMove.js'

crochetOperationFactory
    .registerClass(crochetOperationMakeOrigin)
    .registerClass(crochetOperationBasic)
    .registerClass(crochetOperationCopy)
    .registerClass(crochetOperationMove)

export {crochetOperationFactory}
