import {crochetOperation} from './crochetOperation.js'

class crochetOperationMakeOrigin extends crochetOperation {

    static getCommandName() {return "makeorigin"}

    exec() {
        let newSubject = this.subject.copy()
        let newNode = crochetOperation.nodeFactory.getNewObject(
            "origin",
            this.subject.contextStitch,
            [0,0]
        )
        newSubject.needleStack.push(newNode)
        return this.getBasicResult(newSubject, newNode)
    }

}

export {crochetOperationMakeOrigin}
