import {crochetOperation} from './crochetOperation.js'
import {vec2d} from '../../misc/vector.js'

class crochetOperationMove extends crochetOperation {

    static getCommandName() {return "mv"}

    exec() {


        let newSubject, cmd

        cmd = this.params[0]
        newSubject = this.subject.copy()

        if (cmd == "needle") {
            newSubject.otherLoops.push( newSubject.needleStack.pop() )
        } else if (cmd == "other")  {
            newSubject.needleStack.push( newSubject.otherLoops.pop() )
        } else {
            throw`crochetOperationMove : Expected parameter to be 'needle' or 'other', got '${cmd}'`
        }

        let res = this.getBasicResult(newSubject)
        return res

    }
}

export {crochetOperationMove}
