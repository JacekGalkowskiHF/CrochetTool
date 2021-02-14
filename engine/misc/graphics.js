import {vec2d} from './vector.js'

// *** these classes are jsut to make sure that the objects we parse are of proper format ***

class graphTwoVector {
    constructor() {
        var args = Array.prototype.slice.call(arguments);
        let clean = [];
        if (args.length == 1 && args[0] instanceof Array && args[0].length > 1) {
            clean = args[0];
        };
        if (arguments.length > 1) {
            clean =  args;
        };
        clean = clean.filter(e=>(e instanceof vec2d));
        if (clean.length < 2) throw `graphTwoVector : not enough vectors`;
        this.vAbs = clean[0];
        this.vPerc = clean[1];
    }
}

class graphCommand {
    constructor(cmd, params) {
        if (typeof(cmd) != "string") throw `graphCommand : command must be a string`
        if (!(params instanceof Array)) throw `graphCommand : params must be an Array of graphTwoVector`
        params = params.filter(e=>(e instanceof graphTwoVector))
        this.cmd = cmd
        this.params = params
    }
}


class plotter {

    // *** some elementary geometry ***

    // resets frame of reference for the link
    // i.e. it's base vectors used in drawing path calculation
    static getBase(from, to) {
        let start = from
        let v = to.sub(start)
        // calc base vectors
        let basePhi = v.phi()
        if (isNaN(basePhi)) basePhi = 0
        let baseLen = v.len()
        if (baseLen<1) baseLen = 1
        return {baseOrigin: start, baseLen : baseLen, basePhi: basePhi}
    }

    // given base parameters and two-vector parameter, returns the actual point to draw
    static calcPathPoint(vecAbs = new vec2d(0,0), vecPerc = new vec2d(1,0), base= new vec2d(1,0)){
        let v = vecAbs.rot(base.basePhi)
        let u = vecPerc.scale(base.baseLen).rot(base.basePhi)
        return v.add(u)
    }

    // *** primitive SVG path (attr. d) command generators ****

    // generates SVG path to move pen to links Source point
    static SVGpathResetPen(base){
        return "M " + base.baseOrigin.getTxt()
    }

    // generate typical SVG command from several (vec2d) points
    static SVGpathGeneric(cmd, numPts, vecArr) {
        if (vecArr.filter(e=>(e instanceof vec2d)).length < numPts) {
            throw `getSVGcmd : not enough vectors in veec2Arr for command '${cmd}'. Expected ${numPts}`
        }
        let dPoints = vecArr
            .slice(0,numPts)
            .filter(e=>(e instanceof vec2d))
            .map(e=>e.getTxt())
            .join(" ")
        return `${cmd} ${dPoints}`
    }

    static SVGpathArc (vecArr, base) {
        if (vecArr.filter(e=>(e instanceof vec2d)).length < 4) {
            throw `getSVGcmd : not enough vectors in vecArr for command 'a'. Expected 4`
        }
        let dCmd = "a "
        dCmd += vecArr[0].rot(-base.basePhi).getTxt() + " " // arc radii
        dCmd += ( -vecArr[1].phi() / Math.PI * 180) + " "   // arc major axis rotation
        dCmd += vecArr[2]._x + " " + vecArr[2]._y + " "     // arc draw flags
        dCmd += vecArr[3].getTxt()                          // arc end
        return dCmd
    }

    static SVGpathCommandFactory (func, cmd, numPts, base, vecArr){
        switch (func) {
            case "reset" : return plotter.SVGpathResetPen(base);
            case "arc" : return plotter.SVGpathArc(vecArr, base);
            case "generic" : return plotter.SVGpathGeneric(cmd, numPts, vecArr);
            default : return "";
        }
    }

    // allowed commands (and their setup) that can be translated into 'd' attribute for SVG path
    // numPts: how many twoVectors are needed
    // mapped : what the rendered command (might) be
    // funcs : which functions should convert twoVectors to SVG 'd' commands
    static allowedCommands = new Map([
        ["M", {numPts: 1, mappedCmd: "m", funcs : ["reset", "generic"]}],
        ["m", {numPts: 1, mappedCmd: "m", funcs : ["generic"]}],
        ["L", {numPts: 1, mappedCmd: "l", funcs : ["reset", "generic"]}],
        ["l", {numPts: 1, mappedCmd: "l", funcs : ["generic"]}],
        ["Q", {numPts: 3, mappedCmd: "q", funcs : ["reset", "generic"]}],
        ["q", {numPts: 3, mappedCmd: "q", funcs : ["generic"]}],
        ["T", {numPts: 3, mappedCmd: "t", funcs : ["reset", "generic"]}],
        ["t", {numPts: 3, mappedCmd: "l", funcs : ["generic"]}],
        ["C", {numPts: 3, mappedCmd: "c", funcs : ["reset", "generic"]}],
        ["c", {numPts: 3, mappedCmd: "c", funcs : ["generic"]}],
        ["a", {numPts: 4, mappedCmd: " ", funcs : ["arc"]}],
    ])

    // *** combine everything together ***

    // having the tokenized path drawing commands and links start and end,
    // generate the applicable SVG path to be drawn
    static getPathTxt(sourceVec, targetVec, pathDef) {

        if (!(sourceVec instanceof vec2d)) throw`getPathTxt : sourceVec must be a vec2d vector`
        if (!(targetVec instanceof vec2d)) throw`getPathTxt : targetVec must be a vec2d vector`
        if (!(pathDef instanceof Array)) throw`pathDef : targetVec must be an Array of [graphCommand]`
        pathDef = pathDef.filter(e=>(e instanceof graphCommand))
        console.log(pathDef)
        // establish frame of reference
        let base = plotter.getBase(sourceVec, targetVec)
        // * parse the command *
        // start by moving to link source
        let path = plotter.SVGpathResetPen(base)
        // parse each path command
        let pathSteps = pathDef.map(pathCommand=>{
            let vectors = pathCommand.params.map(
                e => plotter.calcPathPoint(e.vAbs, e.vPerc, base)
            )
            let {numPts, mappedCmd, funcs} = plotter.allowedCommands.get(pathCommand.cmd)
            let pathStepParts = funcs.map(
                e => plotter.SVGpathCommandFactory(
                    e,
                    mappedCmd,
                    numPts,
                    base,
                    vectors
                )
            )
            return pathStepParts.join(" ")
        })
        return path += " " + pathSteps.join(" ")
    }
  }

export {plotter, graphTwoVector, graphCommand}
