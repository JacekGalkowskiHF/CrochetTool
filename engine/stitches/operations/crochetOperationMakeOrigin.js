import {crochetOperation} from './crochetOperation.js'

class crochetOperationMakeOrigin extends crochetOperation {

    static getCommandName() {return "makeorigin"}

    exec() {
        let newNode, newSubject
        newSubject = this.subject.copy()
        newNode = crochetOperation.nodeFactory.getNewObject("origin", this.subject.contextStitch, [0,0])
        newSubject.needleStack.push(newNode)
        let res = this.getBasicResult(newSubject, newNode)
        return res
    }

}

export {crochetOperationMakeOrigin}
