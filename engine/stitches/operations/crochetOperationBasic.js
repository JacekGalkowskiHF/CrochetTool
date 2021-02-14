import {crochetOperation} from './crochetOperation.js'

class crochetOperationBasic extends crochetOperation {

    static getCommandName() {return "mk"}
    static minParams() {return 2}

    exec(){
        let newLinkType = this.params[0]
        let newNodeType = this.params[1]
        let source = this.subject.needleStack.pop();
        let newPos = crochetOperationBasic.CALC_DEF_NEW_POS(source, newLinkType) // ??? where to put this function best ???
        let newNode = crochetOperation.nodeFactory.getNewObject(newNodeType, this.subject.stitch, newPos);
        let newLink = crochetOperation.linkFactory.getLink(newLinkType, this.subject.stitch, source, newNode);

        this.subject.needleStack.push(target);

        let res = this.getBasic()
        res.newNode = newNode
        res.newLink = newLink
        return res
  }

}

export {crochetOperationBasic}
