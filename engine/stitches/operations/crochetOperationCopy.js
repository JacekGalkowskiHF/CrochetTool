import {crochetOperation} from './crochetOperation.js'
import {vec2d} from '../../misc/vector.js'

class crochetOperationCopy extends crochetOperation {

    static getCommandName() {return "cp"}

    exec() {

        let cmd = this.params[0]
        if (cmd!="needle" && cmd!="other") throw`crochetOperationCopy : Expected parameter to be 'needle' or 'other', got '${cmd}'`

        let newSubject = this.subject.copy()
        let tmp = (
            cmd == "needle"
            ? newSubject.needleStack.pop()
            : newSubject.otherLoops.pop()
        )

        newSubject.otherLoops.push(tmp)
        newSubject.needleStack.push(tmp)
        return this.getBasicResult(newSubject)

    }

}

export {crochetOperationCopy}
