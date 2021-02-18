import {crochetOperation} from './crochetOperation.js'
import {vec2d} from '../../misc/vector.js'

class crochetOperationBasic extends crochetOperation {

    static getCommandName() {return "mk"}
    static minParams() {return 2}

    static CALC_DEF_NEW_POS(fromNode, byLinkType) {

        //setup
        let len = crochetOperation.linkFactory.getClass(byLinkType).getDefLen();
        let start = fromNode.getVector();

        // initial direction of the new position is relative to fromNode
        // pointing away from center of mass of its neighbors
        let neighbors = fromNode.getNeighborNodes(); // by def. fromnode will be excluded
        if (neighbors.length==0) neighbors=[fromNode];
        let neighborVecs = neighbors.map(e=>e.getVector())
        let avgNeighborVec = vec2d.SUM(neighborVecs).scale(1/neighborVecs.length);
        let delta = start.sub(avgNeighborVec);

        // fix corner cases
        if (delta.len()>0) {
            // delta<>(0,0) => neighbors' CoM is not same as fromNode => go in opposite dir to it
            delta = delta.len(len);
            // CoM same as fromNode => extend the fromnode position outwards but turn by PI/20
            if (neighbors[0]==fromNode) {delta = delta.rot(Math.PI/20)};
        } else {
            // delta == (0,0), then
            // default direction is UP
            //unless start node was off-center by a enough, then follow that
            let dir = (start.len() < 0.01) ? new vec2d(0,-1) : start.unit().rot(Math.PI/20);
            delta = dir.len(len);
        }

        return start.add(delta);
    }


    exec(){

        let newSubject, sourceNode, newNodeType, newNode, newLinkType, newLink, newPos

        [newLinkType, newNodeType] = this.params
        newSubject = this.subject.copy()
        sourceNode = newSubject.needleStack.pop();

        newPos = crochetOperationBasic.CALC_DEF_NEW_POS(sourceNode, newLinkType) // ??? where to put this function best ???
        newNode = crochetOperation.nodeFactory.getNewObject(newNodeType, this.subject.stitch, newPos);
        newLink = crochetOperation.linkFactory.getNewObject(newLinkType, this.subject.stitch, sourceNode, newNode);
        newSubject.needleStack.push(newNode);
        let res = this.getBasicResult(newSubject, newNode, newLink)
        return res
    }

}

export {crochetOperationBasic}
