import {crochetOperation} from './crochetOperation.js'
import {vec2d} from '../../misc/vector.js'

class crochetOperationMerge extends crochetOperation {

    static getCommandName() {return "merge"}

    exec() {

        let cmd = this.params[0]
        let newSubject = this.subject.copy()

        let targetNode, sourceNode
        let deletedLink = false

        if (newSubject.needleStack.length<2) throw`crochetOperationMerge : not enough nodes on needle to merge`

        if (cmd == "left") {
            targetNode = newSubject.needleStack.pop()
            sourceNode = newSubject.needleStack.pop()
        } else if (cmd == "right")  {
            sourceNode = newSubject.needleStack.pop()
            targetNode = newSubject.needleStack.pop()
        } else {
            if (cmd!="needle" && cmd!="other") throw`crochetOperationMerge : Expected direction to be 'left' or 'right', got '${cmd}'`
        }

        let linksToTransfer = sourceNode.getNeighborLinks()
        let existingNeighbors = targetNode.getNeighborNodes()

        linksToTransfer.forEach( e => {
            // if target and source were linked, this link is not valid anymore
            if (e.getOtherEnd(sourceNode) == targetNode) {
                deletedLink = e
            } else {
                if (!existingNeighbors.includes(e.getOtherEnd(sourceNode)))
                e.replaceNode(sourceNode, targetNode)
            }
        })

        let res = this.getBasicResult(newSubject, false, false, sourceNode, deletedLink)
        return res

    }
}

export {crochetOperationMerge}
