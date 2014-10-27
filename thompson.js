var Lexer = require('./lexer');

/* The McNaughton-Yamada-Thompson Algorithm */

var Thompson = function(pattern) {
  this._pattern = pattern;
  this._Lexer   = new Lexer(pattern);
}



Thompson.prototype = (function() {

  /*
   ** Public
   */

  var transform = function() {
    var state          = 1,
        automaton      = [],
        stack          = [],
        rule,
        temp, temp2;
    while((rule = this._Lexer.getNextRule()) != 'EMPTY') {
      if (rule == 'KLEENE_STAR') {
        automaton.push({"": [state, state+2]});
        temp = {};
        state++;
        stack.push(state);
        temp[this._Lexer.scanner] = [state-1, ++state];
        automaton.push(temp);
        automaton.push({"": [state-1]});
      }
      if (rule == 'UNION') {
        if (stack.length) {
          //todo
        } else {
          temp = {};
          temp[this._Lexer.scanner.shift()] = [state+1];
          automaton.push(temp);
          state++;
          automaton.push({"": [state + 3]});
          state++;
          temp = {};
          temp[this._Lexer.scanner.shift()] = [state+1];
          automaton.push(temp);
          automaton.push({"": [state+2]});
          state++;
          automaton.splice(state-4, 0, {"": [state-3, state-1]});
        }
        state++;
      }
      if (rule == 'CONCAT') {
          temp = {};
          if (state - 2 >= 1) {
            temp[this._Lexer.scanner.pop()] = [state+1];
            automaton.push(temp);
            state++;
          } else {
            automaton.push({"": [state]});
            temp[this._Lexer.scanner.shift()] = [state-1 || state+1];
            automaton.push(temp);
            state++;
            temp = {};
            temp[this._Lexer.scanner.shift()] = [state+1];
            automaton.push(temp);
            state++;
          }
      }
      if (rule == 'CHAR') {
        temp = {};
        temp[this._Lexer.scanner] = [++state];
        automaton.push(temp);
      }
    }
    automaton.push({});
    return automaton;
  };

  return {
    Constructor: Thompson,
    transform: transform,
  };

})();

module.exports = Thompson;