import {crochetOperation} from './crochetOperation.js'

class crochetOperationBasic extends crochetOperation {

    static getCommandName() {return "mk"}
    static minParams() {return 2}

    exec(){
        let newLinkType = this.params[0]
        let newNodeType = this.params[1]
        let source = this.subject.needleStack.pop();
        let newNode, newLink, newPos

        try {
            newPos = crochetOperationBasic.CALC_DEF_NEW_POS(source, newLinkType) // ??? where to put this function best ???
        } catch(e) {
            thow`crochetOperationBasic : failed to calualte new node position. Reason: ${e}`
        }
        try {
            newNode = crochetOperation.nodeFactory.getNewObject(newNodeType, this.subject.stitch, newPos);
        } catch(e) {
            thow`crochetOperationBasic : failed to create new node '${newNodeType}'. Reason: ${e}`
        }
        try {
            newLink = crochetOperation.linkFactory.getLink(newLinkType, this.subject.stitch, source, newNode);
        } catch(e) {
            thow`crochetOperationBasic : faield to create new link '${newLinkType}'. Reason: ${e}`
        }

        this.subject.needleStack.push(target);

        let res = this.getBasic()
        res.newNode = newNode
        res.newLink = newLink
        return res
  }

}

export {crochetOperationBasic}
