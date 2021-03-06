/** section: lang
 *  $H([object]) -> Hash
 * 
 *  Creates a Hash (which is synonymous to “map” or “associative array” for our purposes). 
 *  A convenience wrapper around the Hash constructor, with a safeguard that lets you pass 
 *  an existing Hash object and get it back untouched (instead of uselessly cloning it).
 **/
function $H(object) {
  return new Hash(object);
};

/** section: lang
 * class Hash
**/
var Hash = Class.create(Enumerable, (function() {
  /**
   *  new Hash([object])
   *
   *  TODO: new Hash
   **/
  function initialize(object) {
    this._object = Object.isHash(object) ? object.toObject() : Object.clone(object);
  }

  function _each(iterator) {
    for (var key in this._object) {
      var value = this._object[key], pair = [key, value];
      pair.key = key;
      pair.value = value;
      iterator(pair);
    }
  }

  /**
   *  Hash#set(key, value) -> value
   *
   *  Sets the hash’s `key` property to value and returns value.
  **/
  function set(key, value) {
    return this._object[key] = value;
  }

  /**
   *  Hash#get(key) -> value
   *
   *  Returns the value of the hash’s `key` property.
  **/
  function get(key) {
    // simulating poorly supported hasOwnProperty
    if (this._object[key] !== Object.prototype[key])
      return this._object[key];
  }

  /**
   *  Hash#unset(key) -> value
   *
   *  Deletes the hash’s `key` property and returns its value.
  **/
  function unset(key) {
    var value = this._object[key];
    delete this._object[key];
    return value;
  }

  /**
   *  Hash#toObject() -> Object
   *
   *  Returns a cloned, vanilla object.
  **/
  function toObject() {
    return Object.clone(this._object);
  }

  /**
   *  Hash#keys() -> [String...]
   *  
   *  Provides an Array of keys (that is, property names) for the hash.
  **/
  function keys() {
    return this.pluck('key');
  }

  /**
   *  Hash#values() -> Array
   *
   *  Collect the values of a hash and returns them in an array.
  **/
  function values() {
    return this.pluck('value');
  }

  /**
   *  Hash#index(value) -> String
   *  
   *  TODO: Hash#index
  **/
  function index(value) {
    var match = this.detect(function(pair) { 
      return pair.value === value; 
    });
    return match && match.key;
  }

  /**
   *  Hash#merge(object) -> Hash
   *
   *  Merges `object` to hash and returns the result of that merge. 
   *  Prior to v1.6.0: This was destructive (object's values were added to hash).
   *  Since v1.6.0: This is no longer destructive (hash is cloned before the operation).
  **/
  function merge(object) {
    return this.clone().update(object);
  }

  /**
   *  Hash#update(object) -> Hash
   *
   *  Updates hash with the key/value pairs of `object`.
   *  The original hash will be modified.
  **/
  function update(object) {
    return new Hash(object).inject(this, function(result, pair) {
      result.set(pair.key, pair.value);
      return result;
    });
  }

  /**
   *  Hash#toQueryPair(key, value) -> String
   *  
   *  TODO: Hash#toQueryPair
  **/
  function toQueryPair(key, value) {
    if (Object.isUndefined(value)) return key;
    return key + '=' + encodeURIComponent(String.interpret(value));
  }

  /** related to: String#toQueryParams
   *  Hash#toQueryString() -> String
   *  
   *  Turns a hash into its URL-encoded query string representation.
  **/
  function toQueryString() {
    return this.inject([], function(results, pair) {
      var key = encodeURIComponent(pair.key), values = pair.value;
      
      if (values && typeof values == 'object') {
        if (Object.isArray(values))
          return results.concat(values.map(toQueryPair.curry(key)));
      } else results.push(toQueryPair(key, values));
      return results;
    }).join('&');
  }

  /** related to: Object.inspect
   *  Hash#inspect() -> String
   *  
   *  Returns the debug-oriented string representation of the hash.
  **/
  function inspect() {
    return '#<Hash:{' + this.map(function(pair) {
      return pair.map(Object.inspect).join(': ');
    }).join(', ') + '}>';
  }

  /** related to: Object.toJSON
   *  Hash#toJSON() -> String
   * 
   *  Returns a JSON string.
  **/
  function toJSON() {
    return Object.toJSON(this.toObject());
  }

  /**
   *  Hash#clone() -> newHash
   *
   *  Returns a clone of hash.
  **/
  function clone() {
    return new Hash(this);
  }
  
  return {
    initialize:             initialize,
    _each:                  _each,
    set:                    set,
    get:                    get,
    unset:                  unset,
    toObject:               toObject,
    toTemplateReplacements: toObject,
    keys:                   keys,
    values:                 values,
    index:                  index,
    merge:                  merge,
    update:                 update,
    toQueryString:          toQueryString,
    inspect:                inspect,
    toJSON:                 toJSON,
    clone:                  clone
  };
})());

Hash.from = $H;
