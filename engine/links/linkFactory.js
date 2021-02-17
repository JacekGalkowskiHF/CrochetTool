import {factoryClass} from '../misc/factory.js'
import {crochetLink} from './crochetLink.js'

let crochetLinkFactory = new factoryClass(crochetLink, "getType")

import {crochetLinkSequential} from './crochetLinkSequential.js'
import {crochetLinkExternal} from './crochetLinkExternal.js'
import {crochetLinkCHSpace} from './crochetLinkCHSpace.js'
import {crochetLinkZero} from './crochetLinkZero.js'
import {crochetDraw} from './crochetDraw.js'

crochetLinkFactory
    .registerClass(crochetLinkSequential)
    .registerClass(crochetLinkExternal)
    .registerClass(crochetLinkCHSpace)
    .registerClass(crochetLinkZero)
    .registerClass(crochetDraw)

export {crochetLinkFactory}
