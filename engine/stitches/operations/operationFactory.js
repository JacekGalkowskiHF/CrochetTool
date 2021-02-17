import {factoryClass} from '../../misc/factory.js'
import {crochetOperation} from './crochetOperation.js'


let crochetOperationFactory = new factoryClass(crochetOperation, "getCommandName")

import {crochetOperationMakeOrigin} from './crochetOperationMakeOrigin.js'
import {crochetOperationBasic} from './crochetOperationBasic.js'

crochetOperationFactory
    .registerClass(crochetOperationMakeOrigin)
    .registerClass(crochetOperationBasic)

export {crochetOperationFactory}
