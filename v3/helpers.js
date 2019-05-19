function IdGenerator( pre ) {
	this.index = 0;
	this.prefix = pre;
	this.next = function() {
		return pre + '_' + this.index++;
	};
};

// An object that helps define error codes and messages and throw them, reducing the amount of  error handling code in other classes
ErrorHandler = {
	_errors : [],
	
	throwError : function() {
		var err = ErrorHandler._errors.filter( e => ( e.code == arguments[0] ) )[0];
		var cd, mod, msg;
		cd = arguments[0];
		mod = ( 'undefined' !== typeof err ) ? ( ( null !== err.module ) ? err.module : '' ) : '';
		msg = ( 'undefined' !== typeof err ) ? ( ( null !== err.message ) ? err.message : '' ) : '';
		for ( i = 1; i < arguments.length; i ++ ) {
			msg = msg.replace( '$' + i, arguments[i].toString() );
		};
		if ( '' !== mod && '' !== msg ) {
			console.error( mod + ' - ' + msg );
		} else if ( '' !== mod || '' !== msg ) {
			console.error( mod + msg );
		} else {
			console.error( cd );
		};
		throw cd;
	},
	
	registerNewError : function( code, module, message ) {
		if ( '' === code) {
			ErrorHandler.throwError( "ErrorHandler 001");
		};
		if ( ! ( 'string' === typeof code &&
			( null === module || 'string' === typeof module ) &&
			( null === message || 'string' === typeof message) ) ){
			ErrorHandler.throwError( "ErrorHandler 002");
		}
		this._errors.push( {
			'code' : code,
			'module' : ( null !== module ? module : '' ),
			'message' : ( null !== message ? message : '' ),
		} );
	},
}

ErrorHandler.registerNewError( 'ErrorHandler 001', 'ErrorHandler::ErrorHandler( code, module, message)', 'code must not be empty.' );
ErrorHandler.registerNewError( 'ErrorHandler 002', 'ErrorHandler::ErrorHandler( code, module, message)', 'code must be a string, module and message must be a string or empty.' );

////////////////////////////////////////////
// OVERRIDES FOR LACKING IE JAVASCRIPT DEFINITIONS
////////////////////////////////////////////

// in case Array.prototype.find is not defined
if (!Array.prototype.find) {
  console.log ('Array.find() was not defined - aplying override.')
  Object.defineProperty(Array.prototype, 'find', {
    value: function(predicate) {
      if (this === null) {
        throw new TypeError('Array.prototype.find called on null or undefined');
      }
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }
      var list = Object(this);
      var length = list.length >>> 0;
      var thisArg = arguments[1];
      var value;

      for (var i = 0; i < length; i++) {
        value = list[i];
        if (predicate.call(thisArg, value, i, list)) {
          return value;
        }
      }
      return undefined;
    }
  });
}