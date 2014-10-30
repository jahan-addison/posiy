var Parser     = require('./parser');
var fragments  = require('./fragments'),
  FragmentList = fragments.FragmentList,
  Fragment     = fragments.Fragment;

/* The McNaughton-Yamada-Thompson Algorithm */

var Thompson = function(pattern) {
  this._pattern = pattern;
  this._parser  = new Parser(pattern);
};

Thompson.prototype = (function() {
  /*
   ** Private
   */
  var automaton       = new FragmentList(),
      stack           = [],
      state           = 0,
      temp,
      operatorOrder   = Object.freeze({
        '(': 1,
        ')': 1,
        '*': 2,
        '.': 3, 
        '|': 4,
       });

  var connect = function(frag1, frag2) {
    if (frag1 instanceof FragmentList) {
      frag2.addState(++state);      
      frag1.push(frag2);
      return frag1;
    } else {
      temp = new FragmentList();
      frag1.addState(++state);      
      frag2.addState(++state);      
      temp.append([frag1, frag2]);
      return temp;      
    }
  };

  /*
   ** Public
   */

  var transform = function() {
    var RPNArray = this._parser.parse(),
        token;
    while ((token = RPNArray.shift())) {
      switch(token) {
        case '.':
          var e2 = stack.shift(),
              e1 = stack.shift();
          stack.unshift(connect(e2, e1));
          break;
        default:
          stack.push(new Fragment(token));
          break;
      }
    }
    automaton = stack[0].flatten();
    automaton.push({});
    return automaton;
  };

  return {
    Constructor: Thompson,
    transform: transform,
  };

})();

module.exports = Thompson;