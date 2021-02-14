import  {operationSubject} from './operationSubject.js'
import {crochetNodeFactory} from '../../nodes/nodeFactory.js'
import {crochetLinkFactory} from '../../links/linkFactory.js'

class crochetOperation {

  static getCommandName() {return "default"}
  getCommandName() {return this.constructor.getCommandName()}

  static nodeFactory = crochetNodeFactory
  static linkFactory = crochetLinkFactory

  constructor(subject, cmds){
    if (!(subject instanceof operationSubject)) throw` crochetOperation : needs a valid operationSubject`
    if (!(cmds instanceof Array)) throw` crochetOperation : params must be an array [string]`
    this.params = cmds.filter(e=>(typeof(e)=="string"))        // first argument will be an Array of the operation parameters
    this.subject = subject  // rest is the subject of the operation - components of the W.I.P. crochetStitch
  }

  getBasicResult() {
    return {
        newSubject : this.subject.copy(),
        newNode : false,
        newLink : false,
        delNode: false,
        delLink: false
    }
  }

  exec() {
    return this.getBasicResult() // no new links or nodes were created or removed
  }

}

export {crochetOperation}
