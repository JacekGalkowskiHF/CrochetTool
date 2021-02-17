const nodes = [
  {id: 1, x:0, y:0, color:"red"},
  {id: 2, x:0, y:100, vx: 4, vy: 0, color:"black"},
  {id: 2, x:100, y:100, vx: 4, vy: 4, color:"red"},
  {id: 2, x:10, y:00, vx: 0, vy: 4, color:"red"},
  {id: 2, x:0, y:50, vx: 4, vy: 0, color:"red"},
  {id: 2, x:50, y:0, vx: 0, vy: 0, color:"red"},
  {id: 2, x:-50, y:0, vx: 0, vy: 0, color:"red"},
  {id: 2, x:50, y:0, vx: 0, vy: 0, color:"red"},//{id: 3, x:100, y:0, vy:20, color:"green"}
]

const simulation = d3
    .forceSimulation()
    .alpha(1)
    .alphaDecay(0)
    .velocityDecay(0)
    .force("charge", d3.forceManyBody().strength(1))//.stop()
    //.force("x", d3.forceX().strength(0.005))
    //.force("y", d3.forceY().strength(0.005))
    //.force("e", d3.forceCollide(10))
    .force("c", d3.forceCenter())


const app = Vue.createApp({

    data() {
        return {
            nodes: nodes,
            simulation: simulation,
            maxr : 0,
            hist: []
        }
    },

    mounted: function() {
        this.simulation.nodes(this.nodes)
    },

    methods : {
        tick(){
            this.nodes.push({ x:0, y:0, vx: 0, vy: 0, color:"green"})
            this.simulation.nodes(this.nodes)
        },
        startsim() {
            this.simulation.restart()
            console.console.log("started");
        },
        stopsim() {
            this.simulation.stop()
        }
    },

    computed : {
        r() {
            return ((this.nodes[1].x)^2 + (this.nodes[1].y)^2)
        }
    },

    watch: {
        r : function(newr) {
            this.maxr = Math.max(this.maxr, newr)
            this.hist.push({x: this.nodes[1].x, y: this.nodes[1].y})
            this.hist = this.hist.slice(-100)
        }
    }


})
