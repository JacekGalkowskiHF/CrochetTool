import {crochetOperation} from './crochetOperation.js'
import {vec2d} from '../../misc/vector.js'

class crochetOperationCopy extends crochetOperation {

    static getCommandName() {return "cp"}

    exec() {


        let newSubject, newNode, tmp, cmd

        cmd = this.params[0]
        newSubject = this.subject.copy()

        if (cmd!="needle" && cmd!="other") throw`crochetOperationCopy : Expected parameter to be 'needle' or 'copy', got '${cmd}'`

        tmp = (cmd == "needle" ? newSubject.needleStack.pop() : newSubject.otherLoops.pop())
        newSubject.otherLoops.push(tmp)
        newSubject.needleStack.push(tmp)

        let res = this.getBasicResult(newSubject, newNode)
        return res

        }

}

export {crochetOperationCopy}
