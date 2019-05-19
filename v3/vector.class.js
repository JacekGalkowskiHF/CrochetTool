function Vector() {

	var argLen = arguments.length;

	// set the vector, given the new coordinates as an array of numbers
	this._setArray = function( arrayInput ) {

		// we need at least two arguments, each a number. Surplus coordinates will be ignored
		if ( ( 2 > arrayInput.length ) ) {
			ErrorHandler.throwError( 'Vector 002' );
		};
		if (  ! ( 'number' === typeof( arrayInput[0] ) && 'number' === typeof( arrayInput[1] ) ) ) {
			ErrorHandler.throwError( 'Vector 003' );
		};
		this._x = arrayInput[0];
		this._y = arrayInput[1];
	};
	
	//check if we have the right number of arguments to construct a vectorargLen = arguments.length;
	if ( argLen < 1 || argLen > 2 ) {
		ErrorHandler.throwError( 'Vector 001' );
	};

	// 1 argument => construct the vector given an array of coordinates 
	if ( 1 === argLen ) {
		if ( ! ( arguments[0] instanceof Array ) ) {
			ErrorHandler.throwError( 'Vector 004', arguments.constructor.name );
		} else {
			this._setArray( arguments[0] );	
		}
	};

	// 2 arguments => construct the vector using each coordinate separately
	if ( 2 === argLen ) {
		this._setArray( arguments );
	};
	
	// overrides the default .toString()
	this.toString = function() {
		return '[Vector (' + this._x + ', ' + this._y + ')]';
	}

	// return an array of coordinates of the vector
	this.getArray = function() {
		return [ this._x, this._y ];
	};

	// return a new vector := sum of this and given
	this.getSumVector = function( v ) {
		if ( ! ( v instanceof Vector ) ) {
			ErrorHandler.throwError( 'Vector 005', v.constructor.name );
		} else {
			return new Vector( this._x + v._x, this._y + v._y );
		};
	};

	// move this vector by a delta, return this vector
	this.moveByVector = function( v ) {
		if ( ! ( v instanceof Vector ) ) {
			ErrorHandler.throwError( 'Vector 006', v.constructor.name );
		} else {
			return this._setArray( this.getSumVector( v.getArray() ) );
		};
	};

	// return the dot product of this and a given vector
	this.getDotProduct = function( v ) {
		if ( ! ( v instanceof Vector ) ) {
			ErrorHandler.throwError( 'Vector 007', v.constructor.name );
		} else {
			return this._x * v._x + this._y * v._y;
		};
	};

	// return the cross product (length) of this and a given vector
	this.getCrossProductLen = function( v ) {
		if ( ! ( v instanceof Vector ) ) {
			ErrorHandler.throwError( 'Vector 008', v.constructor.name );
		} else {
			return this._x * v._y - this._y * v._x;		
		};
	};

	// return the length of this 
	this.getLen = function() {
		return Math.sqrt( this._x * this._x + this._y * this._y );
	};

	// scale this by a scalar, returns this
	this.scale = function( s ) {
		if ( ! ( 'number' ===  typeof( s ) ) ) {
			ErrorHandler.throwError( 'Vector 009', v.constructor.name );
		} else {
			this._x *= s;
			this._y *= s;
			return this;
		};
	}; 

	// return a new Vector: the unit base along the direction
	this.getBaseA = function( ){
		if ( this.getLen() == 0 ) {
			return new Vector( 0, 1 );
		} else {
			var result = new Vector( this.getArray() );
			return result.scale( 1 / this.getLen() );
		}
	};

	// rotate this by an angle (argument is the angle, in radians), or by the angle of another vector (argument is a Vector)
	// returns this
	this.rotate = function( phi ) {
		var e1, e2, newX, newY;
		if ( ! ( 'number' === typeof( phi ) ) && ! ( phi instanceof Vector ) ) {
			ErrorHandler.throwError( 'Vector 010', phi.constructor.name );
		};
		if ( 'number' === typeof( phi ) ) {
			e1 = Math.cos( phi );
			e2 = Math.sin( phi );
		} else {
			e1 = phi.getBaseA()._x;
			e2 = phi.getBaseA()._y;
		};
		newX = e1 * this._x - e2 * this._y;
		newY = e2 * this._x + e1 * this._y;
		this._x = newX;
		this._y = newY;
		return this;
	};

	// return a new Vector: the unit base normal (anti-clockwise) to this
	this.getBaseL = function() {
		if ( this.getLen() == 0 ) {
			return new Vector( -1, 0 );
		} else {
			return this.getBaseA().rotate( new Vector( 0, 1 ) );
		}
	};

	// return a new Vector: the unit base normal (clockwise) to this
	this.getBaseR = function() {
		if ( this.getLen() == 0 ) {
			return new Vector( 1, 0 );
		} else {
			return this.getBaseA().rotate( new Vector( 0, -1 ) );
		}
	};

	// return a projection of a given Vector onto this
	this.getProjectionOf = function () {
		var v, baseNormal, result;
		
		// 1st argument (required) - the vector to be projected
		// 2nd argument (optional)- bool: false (default)- project to tangent vector, true - project to normal vector
		if ( arguments.length < 1 ) {
			ErrorHandler.throwError( 'Vector 011' );
		};
		v = arguments[0];
		
		// optionally set the direction from tangent to normal
		if ( arguments.length > 1 ) {
			baseNormal = true && arguments[1];
		} else {
			baseNormal = false
		};
		
		// is the input even a Vector itself? if so, then project to the desired base.
		if ( ! ( v instanceof Vector ) ) {
			ErrorHandler.throwError( 'Vector 012', v.constructor.name );
		} else {
			if ( !baseNormal ) {
				result = this.getBaseA().scale( this.getBaseA().getDotProduct( v ) );
			} else {
				result = this.getBaseL().scale( this.getBaseL().getDotProduct( v ) );
			};
			return result;
		};
	};

	// set this' length
	this.setLen = function( newLen ) {
		var oldLen, newLen;
		if ( 'number' != typeof( newLen ) ) {
			ErrorHandler.throwError( 'Vector 013' );
		} else {
			oldLen = this.getLen();
			if ( oldLen == 0 ) {
				this._x = newLen;
				this._y = 0;
			} else {
				this._x *= ( newLen / oldLen );
				this._y *= ( newLen / oldLen );
			};
			return this;
		};
	};
}
