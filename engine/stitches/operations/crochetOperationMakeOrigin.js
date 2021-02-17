import {crochetOperation} from './crochetOperation.js'

class crochetOperationMakeOrigin extends crochetOperation {

    static getCommandName() {return "makeorigin"}

    exec() {
        let res = this.getBasicResult()
        res.newNode = crochetOperation.nodeFactory.getNewObject("origin", this.subject.contextStitch, [0,0])
        return res
    }

}

export {crochetOperationMakeOrigin}
