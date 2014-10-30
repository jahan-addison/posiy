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

FragmentList.prototype.last  = function() {
  return this.fragments[this.fragments.length-1];
};

FragmentList.prototype.append = function(list) {
  var that = this;
  if (list instanceof FragmentList) {
    while(list.fragments.length) {
      this.push(list.shift());
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
    obj    = {};
    obj[e] = e.get();
    return obj;
  });
};

var Fragment = function(key) {
  this.key   = key;
  this.value = [];
};

Fragment.prototype = (function() {
  return {
    Constructor: Fragment,
    get: function() {
      return this.value;
    },
    toString: function() {
      return this.key;
    },
    addState: function(state) {
      this.value.push(state);
    }
  };

})();

module.exports = {
  FragmentList: FragmentList,
  Fragment:     Fragment
};