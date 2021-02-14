import {crochetOperation} from './crochetOperation.js'
import {vec2d} from '../../misc/vector.js'

class crochetOperationBasic extends crochetOperation {

    static getCommandName() {return "mk"}
    static minParams() {return 2}

    static CALC_DEF_NEW_POS() {
        return [10,10]
    }

    exec(){
        let newLinkType = this.params[0]
        let newNodeType = this.params[1]
        let newSubject = this.subject.copy()
        let source = this.subject.needleStack.pop();
        let newNode, newLink, newPos

        newPos = crochetOperationBasic.CALC_DEF_NEW_POS(source, newLinkType) // ??? where to put this function best ???
        newNode = crochetOperation.nodeFactory.getNewObject(newNodeType, this.subject.stitch, newPos);
        newLink = crochetOperation.linkFactory.getNewObject(newLinkType, this.subject.stitch, source, newNode);

        newSubject.needleStack.push(newNode);

        let res = this.getBasicResult(newSubject, newNode, newLink)
        return res
  }

}

export {crochetOperationBasic}
