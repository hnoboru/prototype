/** section: lang
 * class ObjectRange
**/

/** section: lang
 *  $R(start, end[, exclusive = false]) -> ObjectRange
 *
 *  Creates a new ObjectRange object. 
 *  This method is a convenience wrapper around the ObjectRange constructor, 
 *  but $R is the preferred alias.
**/
function $R(start, end, exclusive) {
  return new ObjectRange(start, end, exclusive);
}

var ObjectRange = Class.create(Enumerable, (function() {
  /**
   *  new ObjectRange(start, end[, exclusive = false])
   *  
   *  TODO: new ObjectRange
  **/
  function initialize(start, end, exclusive) {
    this.start = start;
    this.end = end;
    this.exclusive = exclusive;
  }
  
  function _each(iterator) {
    var value = this.start;
    while (this.include(value)) {
      iterator(value);
      value = value.succ();
    }
  }
  
  /**
   *  ObjectRange#include(value) -> Boolean
   *
   *  Determines whether the value is included in the range.
  **/
  function include(value) {
    if (value < this.start) 
      return false;
    if (this.exclusive)
      return value < this.end;
    return value <= this.end;
  }
  
  return {
    initialize: initialize,
    _each:      _each,
    include:    include
  };
})());

