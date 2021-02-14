import {factoryClass} from '../../misc/factory.js'
import {crochetOperation} from './crochetOperation.js'


let crochetOperationFactory = new factoryClass(crochetOperation, "getCommandName")

import {crochetOperationMakeOrigin} from './crochetOperationMakeOrigin.js'

crochetOperationFactory
    .registerClass(crochetOperationMakeOrigin)

export {crochetOperationFactory}
