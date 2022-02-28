
export default ( path: string, value: object ) => {
    var parts = path.split( "." ),
      length = parts.length,
      i,
      property = value || this;
  
    for ( i = 0; i < length; i++ ) {
      property = property[parts[i]];
    }
  
    return property;
  }