import {factoryClass} from '../misc/factory.js'
import {crochetStitch} from './crochetStitch.js'


let crochetStitchFactory = new factoryClass(crochetStitch, "getType")

import {crochetStitchOrigin} from './crochetStitchOrigin.js'
import {crochetStitchChain} from './crochetStitchChain.js'
import {crochetStitchSingle} from './crochetStitchSingle.js'

crochetStitchFactory
    .registerClass(crochetStitchOrigin)
    .registerClass(crochetStitchChain)
    .registerClass(crochetStitchSingle)

export {crochetStitchFactory}
