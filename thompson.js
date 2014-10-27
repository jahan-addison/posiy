var Lexer = require('./lexer');

/* The McNaughton-Yamada-Thompson Algorithm */

var Thompson = function(pattern) {
  this._pattern = pattern;
  this._Lexer   = new Lexer(pattern);
}



Thompson.prototype = (function() {
  /*
   ** Private
   */
  var state = 0,
      stack = [],
      temp,
      temp2;

  var emptyExpression = function(automaton) {
    automaton.push({"": [++state]});
    stack.push(state-1);
    automaton.push({"": [++state]});
  };

  var symbol = function(n, automaton) {
    if (automaton.length > 1) {
      automaton.pop();
      state--;
    }
    temp = {};
    temp[n] = [++state];
    automaton.push(temp);
    stack.push(state-1);
    automaton.push({"": [++state]});    
  };

  var unionExpression = function(n, automaton) {
  }

  /*
   ** Public
   */

  var transform = function() {
    // go recursion
  };

  return {
    Constructor: Thompson,
    transform: transform,
  };

})();

module.exports = Thompson;