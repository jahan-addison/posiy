var Parser = require('./parser');

/* The McNaughton-Yamada-Thompson Algorithm */

var Thompson = function(pattern) {
  this._pattern = pattern;
  this._parser  = new Parser(pattern);
}



Thompson.prototype = (function() {
  /*
   ** Private
   */
  var automaton       = [],
      stack           = [],
      state           = 0,
      temp, nfa,
      operatorOrder   = Object.freeze({
        '(': 1,
        ')': 1,
        '*': 2,
        '.': 3, 
        '|': 4,
       });

  var symbol = function(s) {
    nfa     = [];
    temp    = {};
    temp[s] = [++state];
    nfa.push(temp);
    return nfa; 
  };

  /*
   ** Public
   */

  var transform = function() {
    var RPNArray = this._parser.parse(),
        token;
    while ((token = RPNArray.shift())) {
      if (!(token in operatorOrder)) {
        stack.push(symbol(token));
      } else {
        switch(token) {
          case '.':
            var e2 = stack.shift(),
                e1 = stack.shift();
            if (e2) {
              e2.forEach(function(e) {
                automaton.push(e);
              });
            }
            if (e1) {
              e1.forEach(function(e) {
                automaton.push(e);
              });
            }
        }
      }
    }
    if (!RPNArray.length) {
      automaton.push({});
    }
    return automaton;
  };

  return {
    Constructor: Thompson,
    transform: transform,
  };

})();

module.exports = Thompson;