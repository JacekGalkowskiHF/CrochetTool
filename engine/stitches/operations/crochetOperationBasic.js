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

        try {
            newPos = crochetOperationBasic.CALC_DEF_NEW_POS(source, newLinkType) // ??? where to put this function best ???
        } catch(e) {
            throw`crochetOperationBasic : failed to calculate new node position. Reason: ${e}`
        }
        console.log(newPos)
        try {
            newNode = crochetOperation.nodeFactory.getNewObject(newNodeType, this.subject.stitch, newPos);
        } catch(e) {
            throw`crochetOperationBasic : failed to create new node '${newNodeType}'. Reason: ${e}`
        }
        console.log(newNode)
        console.log(source)
        try {
            newLink = crochetOperation.linkFactory.getNewObject(newLinkType, this.subject.stitch, source, newNode);
        } catch(e) {
            throw`crochetOperationBasic : faield to create new link '${newLinkType}'. Reason: ${e}`
        }

        this.subject.needleStack.push(newNode);

        let res = this.getBasicResult(newSubject, newNode, newLink)
        return res
  }

}

export {crochetOperationBasic}
