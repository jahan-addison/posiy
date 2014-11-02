/* Fragment data structure */

var FragmentList = function() {
  this.fragments = [];
};

FragmentList.prototype.add = function(fragment) {
  this.fragments.push(fragment);
};
FragmentList.prototype.push = FragmentList.prototype.add;
FragmentList.prototype.pop  = function() {
  return this.fragments.pop();
};

FragmentList.prototype.shift  = function() {
  return this.fragments.shift();
};

FragmentList.prototype.first = function() {
  return this.fragments[0];
};

FragmentList.prototype.index = function(i) {
  return this.fragments[i];
};

FragmentList.prototype.each = function(callback) {
  this.fragments.forEach(callback);
};

FragmentList.prototype.length = function(callback) {
  return this.fragments.length;
};

FragmentList.prototype.last  = function() {
  return this.fragments[this.fragments.length-1];
};

FragmentList.prototype.append = function(list) {
  var that = this,
      i    = 0;
  if (list instanceof FragmentList) {
    while(i < list.fragments.length) {
      that.fragments.push(list.index(i++));
    }
  } else {
    list.forEach(function(e) {
      that.fragments.push(e);
    });
  }
};

FragmentList.prototype.flatten = function() {
  var obj;
  return this.fragments.map(function(e) {
    return e.toObject();
  });
};

var Fragment = function(key, state) {
  this.key   = key;
  this.value = state ? [state] : [];
};

Fragment.prototype = (function() {
  var obj;
  return {
    Constructor: Fragment,
    get: function() {
      return this.value;
    },
    toString: function() {
      return this.key;
    },
    toObject: function() {
      obj       = {};
      obj[this] = this.get();
      return obj;
    },
    addState: function(state) {
      this.value.push(state);
    },
    updateState: function(i, state) {
      this.value[i] = state;
    }
  };

})();

module.exports = {
  FragmentList: FragmentList,
  Fragment:     Fragment
};