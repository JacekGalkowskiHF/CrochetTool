import {crochetLink} from './crochetLink.js'
import {vec2d} from '../misc/vector.js'

class crochetDraw extends crochetLink{

    // override crochetLink dfaults
    static getType() {return "draw"}
    static getDeftLen() {return 10}
    static getDesc() {return "no-strength link used for drawing"}
    static isPrintable() {return true}  // this means it can have its getPath() method used properly!
    strenght() {return 0}

    // add more stuff, specifically needed for displaying
    static getPathDef() {
        return "l:100,0%"
    }
    getPathDef() {return this.constructor.getPathDef()}

    static getColor() {return "black"}
    getColor() {return this.constructor.getColor()}

    // given a path definition, transform it into an array of two-vectors used for drawing
    static tokenizeDrawingCommands(pathStr = "") {

        // what path commands are allowed and how manz points they need
        let allowedCommands = new Map([
            ["l", 1], ["L", 1], ["M", 1], ["m", 1], ["X", 1],
            ["a", 4], ["q", 2], ["Q", 2], ["c", 3], ["C", 3]
        ])

        // transform path definition string to an array of single commands
        let commands = pathStr
            .split(";") // str -> array
            .map(e=>e.trim()) // remove extra spaces
            .filter(e=>e!="") // remove empty commands

        if (commands.length == 0) return []

        // remove invalidly formatted commands
        const command_rgx = /[a-zA-Z\_]+(\ *\:\ *-?[0-9]+\,-?[0-9]+(\%\ *(-?[0-9]+\,-?[0-9]+)?)?)+$/
        commands = commands.filter(c=>(c.match(command_rgx)!==null))

        // translate command string into tokenized command parameters
        let tokenized = commands
            .map(token => {
                    let res={}; // the ; is critical here
                    [res.cmd, ...res.params] = token.split(":").map(e=>e.trim()); // the ; is critical here
                    return res; // the ; is critical here
                })
            .filter(e=>allowedCommands.has(e.cmd)) // valid command name
            .filter(e=>(allowedCommands.get(e.cmd)<=e.params.length)) //with enough param points
        return tokenized
    }

    static parseDrawingCmds(tokenizedCommands=[]) {

        // convert each of the parameters into a two-vector
        // first vector is %-translaton (p,p)
        // second the abs-translation (a,a)
        let parsedCmds = tokenizedCommands
            .map(token=>{

                let paramVectors = token.params
                    .map(param=>{               // "a,a" | "p,p%" | "p,p % a,a"

                        param = "%" + param         // "%a,a" | "%p,p%" "| "%p,p % a,a"

                        let twoVecArray = param
                            .split("%")
                            .map(e => e.trim())       // [ "", "a,a"] | ["", "p,p". ""] | ["", "p,p", "a,a"]
                            .reverse()              // ["a,a", ""] | ["", "p,p". ""] | ["a,a", "p,p", ""]
                            .slice(0,2)             // ["a,a", ""] | ["", "p,p"] | ["a,a", "p,p"]
                            .map(e => (e=="" ? "0,0" : e)) // ["a,a", "0,0"] | ["0,0", "p,p"] | ["a,a", "p,p"]
                            .map(e => e
                                .split(",")
                                .map(e => parseFloat(e))
                            )                       // [[ax,ay],[px,py]] etc..
                            .map(e => new vec2d(e));      // [[vec2d],[vec2d])

                        // %-vector is given in perc.pts., so...
                        twoVecArray[1] = twoVecArray[1].scale(0.01)

                        let twoVector = {};
                        [twoVector.v_abs, twoVector.v_perc] = twoVecArray;

                        return twoVector        // { v_abs: [vec2d], v_perc: [vec2d] }

                    })

                // new token
                return {cmd:token.cmd, params:paramVectors}

            })

        return parsedCmds
    }

    constructor() {
        super(...arguments)
        this.setNewPath()
    }

    setNewPath(p="") {
        let pahtDefString = (p=="") ? this.getPathDef() : p;
        let pathCmds = this.constructor.tokenizeDrawingCommands(pahtDefString)
        this.pathDefVectors = this.constructor.parseDrawingCmds(pathCmds)
    }

}

export {crochetDraw}
