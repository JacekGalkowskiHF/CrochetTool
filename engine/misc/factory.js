class factoryClass {

  constructor(exampleClass, func, argumentNames = [] ) {
     this.className =  exampleClass.name
     if (typeof(exampleClass[func]) == "function") {
         this.getTypeFunc = func
     } else {
         throw`facotryCLass : class '${exampleClass.name}' does not have the method '${func}'`
     }
     this.argumentNames = argumentNames
     this.items = new Map()
     this.registerClass(exampleClass)
  }

  registerClass(newClass){
      try {
          this.items.set(newClass[this.getTypeFunc]() , newClass)
      } catch (error) {
          throw `${this.className} factory : class ${newClass.name} must expose the '${this.getTypeFunc}' method`
      }
    return this
  }

  getNewObject(type, ...rest){
    let cls = this.items.get(type)
    if (typeof cls == "undefined") throw `${this.className} factory : invalid ${this.className} type '${type}'`
    return new cls(...rest)
  }

  getClass(type){
    let cls = this.items.get(type)
    if (typeof cls == "undefined") throw `${this.className} factory : invalid ${this.className} type '${type}'`
    return cls
  }

  isValidType(type){
    return this.items.has(type)
  }

}

export {factoryClass}
