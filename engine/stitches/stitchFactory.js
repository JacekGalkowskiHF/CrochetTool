import {factoryClass} from '../misc/factory.js'
import {crochetStitch} from './crochetStitch.js'


let crochetStitchFactory = new factoryClass(crochetStitch, "getType")

import {} from './crochetOperationMakeOrigin.js'

crochetOperationFactory
    .registerClass(crochetOperationMakeOrigin)


export {crochetStitchFactory}
