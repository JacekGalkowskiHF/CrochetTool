class vec2d{

  constructor() {

    var argLen = arguments.length;
    var tmp_x, tmp_y;

    // 1st. argument an array => construct the vector given an array of coordinates
    if (arguments[0] instanceof Array) {

      if (arguments[0].length < 2) throw "Not enough coordinates in array";
      tmp_x = arguments[0][0];
      tmp_y = arguments[0][1];

    // 1st. arg. not an array => each arg a coordiante
    } else  {

      if (arguments.length < 2) throw "Not enough coordinates";
      tmp_x = arguments[0];
      tmp_y = arguments[1];

    };

    if (typeof(tmp_x)!="number"  || typeof(tmp_y)!= "number") throw "both coordinates must be numbers!";
    this._x = tmp_x;
    this._y = tmp_y;
  };

  getTxt(r=0) {return this._x.toFixed(r)+ ',' + this._y.toFixed(r)}

  toString() {return '[Vector (' + this.getTxt() + ')]'}

  getArray() {return [ this._x, this._y ]}

  add(v) {
    if (!(v instanceof vec2d)) throw "add(v) : v must be a vec2d";
    return new this.constructor( this._x + v._x, this._y + v._y );
  }

  scale(s) { // dot product
    if (typeof(s)!="number" || isNaN(s)) throw "scale(s) : s must be a number";
    return new this.constructor( this._x*s, this._y*s);
  }

  sub(v) {
    if (!(v instanceof vec2d)) throw "sub(v) : v must be a vec2d";
    return this.add(v.scale(-1));
  }

  dot(v) { // dot product
    if (!(v instanceof vec2d))throw "dot(v) : v must be a vec2d";
    return ( this._x * v._x + this._y * v._y );
  }

  xprod(v) { // z of the (would be 3D) tensor multiplication, if input z = const(0)
    if (!(v instanceof vec2d)) throw "xprod(v) : v must be a vec2d";
    return ( this._x * v._y - this._y * v._x );
  }

  len(e) { //  length of the vector
    if (typeof e == 'number') {
      let now = this.len()
      if (now == 0) {
        return new vec2d(0,0)
      } else {
        return this.scale(e/now)
      }
    } else {
      return Math.sqrt(this.dot(this))
    }
  }

  rot(phi) { // rotate the vector by angle phi
    if (typeof(phi)!="number" || isNaN(phi)) throw "rot(phi) : phi must be a number";
    let c = Math.cos(phi);
    let s = Math.sin(phi);
    let new_x = this._x * c + this._y * s;
    let new_y = -this._x * s + this._y * c;
    return new this.constructor( new_x, new_y);
  }

  turnr() {
    return new this.constructor( -this._y, this._x);
  }

  turnl() {
    return new this.constructor( this._y, -this._x);
  }

  unit() {
    return this.scale(1/this.len());
  }

  norm(sgn) {
    return (sgn ? this.unit().turnl() :  this.unit().turnr() );
  }

  phi() {
    // so that (1,0)->0, (0,-1)->PI/2, (-1,0)->PI, (0,1)->3*PI/2
    return (this._x == 0 && this._y==0) ? NaN : (Math.PI + Math.atan2( this._y, -this._x))%(2*Math.PI);
  }

  static SUM(vectors) {
    let a = ((vectors instanceof Array) ? vectors : Array.from(arguments));
    let res
    try {
      res = a.reduce((prev,curr)=>prev.add(curr));
    } catch {
      throw "vec2d.SUM : all elements must be vec2d"
    }
    return res
  }
}

export {vec2d}
